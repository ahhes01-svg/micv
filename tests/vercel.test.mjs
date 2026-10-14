import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {vercelChat} from '../api/chat.mjs';
let n=0;
async function call({body,method='POST',raw,origin='https://portfolio.example'}={},options={}){
 const req=Readable.from(raw===undefined?[]:[raw]);req.method=method;req.body=body;
 req.headers={host:'portfolio.example','x-forwarded-proto':'https','x-forwarded-for':`test-${++n}`,'content-type':'application/json',origin};
 const result={headers:{}};const res={setHeader(key,value){result.headers[key.toLowerCase()]=value;},set statusCode(value){result.status=value;},end(value){result.data=JSON.parse(value);}};
 await vercelChat(req,res,options);return result;
}
test('Vercel adapta el cuerpo JSON y conserva la comprobación del origen',async()=>{
 const body={messages:[{role:'user',text:'¿Qué experiencia tiene Zahir?'}]};
 const options={env:{GEMINI_API_KEY:'test-key'},fetchImpl:async()=>Response.json({candidates:[{content:{parts:[{text:'Soporte TI y desarrollo web.'}]}}]})};
 const response=await call({body},options);assert.equal(response.status,200);assert.equal(response.data.answer,'Soporte TI y desarrollo web.');assert.equal(response.headers['cache-control'],'no-store');
 assert.equal((await call({body,origin:'https://otro.example'},options)).status,403);
 assert.equal((await call({raw:JSON.stringify(body)},options)).status,200);
});
test('Vercel maneja métodos, tamaño, JSON inválido y clave sin configurar',async()=>{
 assert.equal((await call({method:'GET'})).status,405);
 assert.equal((await call({raw:'x'.repeat(24001)})).status,413);
 assert.equal((await call({raw:'{'},{env:{}})).status,400);
 assert.equal((await call({body:{messages:[{role:'user',text:'Hola'}]}},{env:{}})).status,503);
});
