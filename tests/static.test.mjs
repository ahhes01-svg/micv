import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {brotliDecompressSync,gunzipSync} from 'node:zlib';
import {serveStatic} from '../server/static.mjs';
const types={'.css':'text/css'};
async function call(path,headers={},method='GET',url='/css/test.css'){
  const result={};const res={writeHead(status,values){result.status=status;result.headers=values;},end(body){result.body=body;}};
  await serveStatic({url,method,headers},res,path,types);return result;
}
test('caché HTTP, compresión y revalidación no alteran el contenido',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'zahir-cache-')),file=join(dir,'test.css'),content='.card { color: #fff; background: #000; }\n'.repeat(200);
  try{
    await writeFile(file,content);
    const plain=await call(file);assert.equal(plain.status,200);assert.equal(plain.body.toString(),content);assert.match(plain.headers['Cache-Control'],/must-revalidate/);
    const brotli=await call(file,{'accept-encoding':'br, gzip'});assert.equal(brotli.headers['Content-Encoding'],'br');assert.equal(brotliDecompressSync(brotli.body).toString(),content);assert.ok(brotli.body.length<plain.body.length);
    const gzip=await call(file,{'accept-encoding':'gzip, br;q=0'});assert.equal(gzip.headers['Content-Encoding'],'gzip');assert.equal(gunzipSync(gzip.body).toString(),content);
    const none=await call(file,{'accept-encoding':'gzip;q=0, br;q=0'});assert.equal(none.headers['Content-Encoding'],undefined);
    const unchanged=await call(file,{'if-none-match':plain.headers.ETag});assert.equal(unchanged.status,304);assert.equal(unchanged.body,undefined);
    const revision=createHash('sha256').update(content).digest('hex').slice(0,12);
    assert.match((await call(file,{},'GET',`/css/test.css?v=${revision}`)).headers['Cache-Control'],/immutable/);
    assert.doesNotMatch((await call(file,{},'GET','/css/test.css?v=000000000000')).headers['Cache-Control'],/immutable/);
    const head=await call(file,{},'HEAD');assert.equal(head.body,undefined);assert.equal(head.headers['Content-Length'],Buffer.byteLength(content));
    await writeFile(file,content+'\n/* nueva versión */');const changed=await call(file,{'if-none-match':plain.headers.ETag});assert.equal(changed.status,200);assert.notEqual(changed.headers.ETag,plain.headers.ETag);
  }finally{await rm(dir,{recursive:true,force:true});}
});
