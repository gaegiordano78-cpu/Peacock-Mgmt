import test from 'node:test';
import assert from 'node:assert/strict';
import {presentationHtml,officialUrl,PEACOCK_LOGO} from '../app/lib/talent-presentations.mjs';
import {fetchTalent,fetchRoster,verifyImage} from '../app/lib/talent-source.mjs';
const yile={slug:'yile',name:'Yile',profile:'https://peacockmodels.com/modello/yile/',cover:'https://peacockmodels.com/wp-content/uploads/2026/08/cover.jpg',width:1122,height:1402,cardCover:'https://peacockmodels.com/wp-content/uploads/2026/08/cover-card.jpg',cardWidth:700,cardHeight:875};
const png=new Uint8Array(128);png.set([137,80,78,71,13,10,26,10]);
const imageResponse=()=>new Response(png,{headers:{'content-type':'image/png'}});
const json=(value,headers={})=>new Response(JSON.stringify(value),{headers:{'content-type':'application/json',...headers}});
test('single talent uses only original logo and one linked cover, required wording and white background',()=>{
 const h=presentationHtml([yile]);assert.equal((h.match(/<img /g)||[]).length,2);assert.ok(h.includes(PEACOCK_LOGO));assert.ok(h.includes('INTRODUCING'));assert.ok(h.includes('SCOPRI YILE'));assert.ok(h.includes('Oggi vi presentiamo YILE, uno dei talenti rappresentati da Peacock Models Management.'));assert.ok(!h.includes('#eeeae4'));assert.ok(h.includes('PEACOCK MODELS MANAGEMENT · BARI'));assert.ok(h.indexOf('mailto:hello@peacockmodels.com')<h.lastIndexOf('www.peacockmodels.com'));
});
test('multiple talents have one cover each, linked names, responsive stacking and Outlook table fallback',()=>{
 const h=presentationHtml([yile,{...yile,slug:'luigi',name:'Luigi',profile:'https://peacockmodels.com/modello/luigi/'},{...yile,slug:'anna',name:'Anna',profile:'https://peacockmodels.com/modello/anna/'}]);assert.equal((h.match(/<img /g)||[]).length,4);assert.ok(h.includes('NUOVI VOLTI, NUOVE STORIE.'));assert.ok(!h.includes('Vi presentiamo'));assert.ok(!h.includes('SCOPRI '));assert.ok(h.includes('<!--[if mso]>'));assert.ok(h.includes('.talent-cell{display:block!important'));
});
test('no HTML export for empty, duplicate, missing cover or unsafe URLs; text is escaped',()=>{
 for(const t of [[],[yile,yile],[{...yile,cover:''}],[{...yile,profile:'javascript:alert(1)'}],[{...yile,cover:'https://evil.test/a.jpg'}]])assert.throws(()=>presentationHtml(t));
 const h=presentationHtml([{...yile,name:'<script>" &'}]);assert.ok(!h.includes('<script>'));assert.ok(h.includes('&lt;SCRIPT&gt;'));
 for(const u of ['http://peacockmodels.com/wp-content/uploads/a.jpg','https://peacockmodels.com.evil.test/wp-content/uploads/a.jpg','https://x@peacockmodels.com/wp-content/uploads/a.jpg','https://peacockmodels.com:9999/wp-content/uploads/a.jpg'])assert.equal(officialUrl(u,'image'),false);
});
test('featured media is authoritative, including filenames containing chatgpt; no gallery guessing',async()=>{
 const calls=[];const cover='https://peacockmodels.com/wp-content/uploads/2026/08/chatgpt-image-cover.jpg';
 const t=await fetchTalent('yile',async(url,options)=>{calls.push(url);assert.equal(options.redirect,'error');if(url.includes('modello?'))return json([{...yile,title:{rendered:'Yile'},link:yile.profile,featured_media:6088}]);if(url.includes('media/6088'))return json({source_url:cover,media_details:{width:1122,height:1402}});return imageResponse();});
 assert.equal(t.cover,cover);assert.equal(calls.length,4);assert.ok(!calls.some(x=>x.includes('gallery')));
});
test('missing cover, unavailable image and fake image content fail closed',async()=>{
 await assert.rejects(()=>fetchTalent('yile',async()=>json([{slug:'yile',title:{rendered:'Yile'},link:yile.profile,featured_media:0}])));
 await assert.rejects(()=>verifyImage(yile.cover,async()=>new Response('Not found',{status:404})));
 await assert.rejects(()=>verifyImage(yile.cover,async()=>new Response('<html>no image</html>',{headers:{'content-type':'image/jpeg'}})));
});
test('roster paginates and deduplicates all official published profiles',async()=>{
 const t={slug:'yile',title:{rendered:'Yile'},link:yile.profile};
 const rows=await fetchRoster(async url=>url.includes('page=1&')?json([t],{'x-wp-totalpages':'2'}):json([t,{...t,slug:'anna',title:{rendered:'Anna'},link:'https://peacockmodels.com/modello/anna/'}],{'x-wp-totalpages':'2'}));
 assert.deepEqual(rows.map(x=>x.name),['Anna','Yile']);
});

test('multi layout uses official uniform card crops and keeps full cover for the single profile',()=>{
 const h=presentationHtml([yile,{...yile,name:'Anna',profile:'https://peacockmodels.com/modello/anna/'}]);
 assert.equal((h.match(/src="https:\/\/peacockmodels.com\/wp-content\/uploads\/2026\/08\/cover-card.jpg"/g)||[]).length,2);
 assert.equal((h.match(/width="248" height="310"/g)||[]).length,2);
 const single=presentationHtml([yile]);assert.ok(single.includes('src="'+yile.cover+'"'));assert.ok(!single.includes('src="'+yile.cardCover+'"'));
 assert.throws(()=>presentationHtml([{...yile,cardCover:undefined}, {...yile,name:'Anna',profile:'https://peacockmodels.com/modello/anna/'}]),/uniforme 4:5/);
});
test('fetches and validates the official WordPress card crop rather than inventing a cropped URL',async()=>{
 const card='https://peacockmodels.com/wp-content/uploads/2026/08/official-card-700x875.jpg';const calls=[];
 const t=await fetchTalent('yile',async url=>{calls.push(url);if(url.includes('modello?'))return json([{slug:'yile',title:{rendered:'Yile'},link:yile.profile,featured_media:6088}]);if(url.includes('media/6088'))return json({source_url:yile.cover,media_details:{width:1122,height:1402,sizes:{img_card_modello:{source_url:card,width:700,height:875}}}});return imageResponse();});
 assert.equal(t.cover,yile.cover);assert.equal(t.cardCover,card);assert.equal(t.cardWidth,700);assert.equal(t.cardHeight,875);assert.ok(calls.includes(card));
});
