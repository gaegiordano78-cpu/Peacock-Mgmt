const {chromium,devices}=require(process.cwd()+'/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {}),headless:true});
const context=await browser.newContext({...devices['Pixel 7'],reducedMotion:'reduce'});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{
localStorage.setItem('sb-xtpafxourildjnofeulr-auth-token',JSON.stringify({access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer',user:{id:'test-model',aud:'authenticated',role:'authenticated'}}));
});
await page.route('https://xtpafxourildjnofeulr.supabase.co/**',async route=>{
const url=route.request().url();let data=[];
if(url.includes('/profiles'))data={ruolo:'model'};
if(url.includes('/modelle')){const m={id:'model-1',nome:'Test Model',user_id:'test-model'};data=url.includes('user_id=')?m:[m];}
if(url.includes('/jobs'))data=[{id:133,titolo:'SHOOTING TEST',modella:'Test Model',netto_model:'300.00',data_shooting:null,stato_pagamento:'da pagare',stato_job:'confermato'}];
await route.fulfill({json:data});
});
await page.goto(process.env.TEST_APP_URL || 'http://localhost:3096');
await page.getByText('SHOOTING TEST',{exact:true}).click({timeout:30000});
await page.getByRole('button',{name:'Genera ritenuta'}).click();
await page.getByRole('button',{name:'Scarica PDF'}).waitFor();
await page.goBack();
await page.getByRole('button',{name:'Genera ritenuta'}).waitFor();
await page.goBack();
await page.getByRole('button',{name:'Profilo',exact:true}).waitFor();
await page.goForward();
await page.getByRole('button',{name:'Genera ritenuta'}).waitFor();
await page.goForward();
await page.getByRole('button',{name:'Scarica PDF'}).waitFor();
await page.getByRole('button',{name:'Indietro'}).click();
await page.getByRole('button',{name:'Genera ritenuta'}).waitFor();
await page.goBack();
await page.getByRole('button',{name:'Profilo',exact:true}).click();
await page.getByText('Per modificare nome, contratto o altri dati',{exact:false}).waitFor();
await page.goBack();
await page.getByRole('button',{name:'Profilo',exact:true}).waitFor();
await page.getByText('SHOOTING TEST',{exact:true}).click();
await page.getByRole('button',{name:'Genera ritenuta'}).click();
await page.getByRole('button',{name:'Scarica PDF'}).waitFor();
await page.evaluate(()=>{window.open=()=>{throw Error('Unexpected popup')};window.print=()=>{throw Error('Unexpected print')};});
const downloaded = page.waitForEvent('download');
await page.getByRole('button',{name:'Scarica PDF'}).click();
const download=await downloaded;
await download.saveAs(process.env.TEST_PDF_PATH || '/tmp/peacock-receipt-test.pdf');
if(errors.length) throw Error(errors.join(';'));
if(context.pages().length!==1)throw Error('Unexpected new window');
if(!await page.getByRole('button',{name:'Scarica PDF'}).isVisible())throw Error('Receipt page lost');
console.log(JSON.stringify({androidBackAndForward:true,receiptOpened:true,download:download.suggestedFilename(),noPopup:true,errors}));
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
