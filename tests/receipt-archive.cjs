const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium, devices } = require('playwright');
(async () => {
 const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true });
 for (const role of ['model','admin']) {
  const context = await browser.newContext({ ...devices['Pixel 7'], reducedMotion:'reduce' });
  const page = await context.newPage(); let saves=0, gets=0, fail=true, stored=null, downloads=0; const errors=[]; const filters=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('download',()=>downloads++);
  await page.addInitScript(() => localStorage.setItem('sb-xtpafxourildjnofeulr-auth-token',JSON.stringify({access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer',user:{id:'test-model',aud:'authenticated',role:'authenticated'}})));
  await page.route('https://xtpafxourildjnofeulr.supabase.co/**', async route => {
   const url=new URL(route.request().url());let data=[];
   if(url.pathname.includes('/profiles'))data={ruolo:role};
   if(url.pathname.includes('/modelle')) {const m={id:'model-1',nome:'Test Model',user_id:'test-model'};data=url.searchParams.has('user_id')?m:[m];}
   if(url.pathname.includes('/jobs'))data=[{id:133,titolo:'SHOOTING TEST',cliente:'Brand Test',modella:'Test Model',netto_model:300,data_shooting:'2026-10-20',stato_pagamento:'da pagare',stato_job:'confermato'}];
   if(url.pathname.endsWith('/save_receipt')) {
    saves++;const body=route.request().postDataJSON();
    if(fail) {await route.fulfill({status:503,json:{message:'offline'}});return;}
    await new Promise(r=>setTimeout(r,200));
    stored ||= {id:'saved-id',filename:'Test Model per Brand Test.pdf',pdf:body.p_pdf}; data=stored;
   }
   if(url.pathname.endsWith('/get_receipt')){gets++;data=stored;}
   if(url.pathname.endsWith('/receipt_archive')) {
    filters.push(url.search);
    data=stored?[{id:stored.id,filename:stored.filename,model_name:'Test Model',brand:'Brand Test',receipt_number:'7',receipt_date:'2026-10-30',created_at:'2026-10-30T12:00:00Z',gross:375,withholding:75,net:300}]:[];
    await route.fulfill({json:data,headers:{'content-range':`0-${data.length-1}/${data.length}`}});return;
   }
   await route.fulfill({json:data});
  });
  await page.goto(process.env.TEST_APP_URL || 'http://localhost:3097');
  await page.getByText('SHOOTING TEST',{exact:true}).click({timeout:30000});
  await page.getByRole('button',{name:'Genera ritenuta'}).click();
  await page.getByRole('button',{name:'Scarica PDF'}).click();
  await page.getByRole('alert').filter({hasText:'non salvata'}).waitFor();
  assert.equal(downloads,0,'failed saves must not download unarchived PDFs');
  fail=false;
  const firstDownload=page.waitForEvent('download');
  await page.getByRole('button',{name:'Scarica PDF'}).click();
  const first=await firstDownload;
  assert.equal(first.suggestedFilename(),'Test Model per Brand Test.pdf');
  const firstBytes=await fs.readFile(await first.path());
  assert.equal(firstBytes.subarray(0,5).toString(),'%PDF-');
  await page.getByRole('button',{name:'Archivio ritenute',exact:true}).click();
  await page.getByText('Test Model per Brand Test',{exact:true}).waitFor();
  await page.getByPlaceholder('Nome o brand').fill('Brand Test');
  await page.getByLabel('Data ritenuta dal',{exact:true}).fill('2026-10-19');
  await page.getByLabel('Data ritenuta al',{exact:true}).fill('2026-10-30');
  await page.getByText('Test Model per Brand Test',{exact:true}).waitFor();
  const secondDownload=page.waitForEvent('download');
  await page.getByRole('button',{name:'Scarica PDF'}).click();
  const second=await secondDownload;
  assert.deepEqual(await fs.readFile(await second.path()),firstBytes,'archive must return original PDF bytes');
  await page.reload();
  if(role==='model') await page.getByRole('button',{name:'Archivio ritenute',exact:true}).click({timeout:30000});
  else {await page.getByRole('button',{name:'⋯',exact:true}).click();await page.getByRole('button',{name:'Archivio ritenute'}).click();}
  await page.getByText('Test Model per Brand Test',{exact:true}).waitFor();
  assert.equal(saves,2);assert.equal(gets,1);assert.equal(context.pages().length,1);assert.deepEqual(errors,[]);
  assert(filters.some(f=>f.includes('receipt_date=gte.2026-10-19')&&f.includes('receipt_date=lte.2026-10-30')));
  console.log(JSON.stringify({role,saveBeforeDownload:true,failureRetry:true,exactArchivedBytes:true,filters:true,reloadPersistence:true,noPopup:true}));
  await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
