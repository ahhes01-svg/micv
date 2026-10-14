import {stat,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {brotliCompress,gzip,constants} from 'node:zlib';
import {promisify} from 'node:util';
import {extname} from 'node:path';
const brotli=promisify(brotliCompress),gzipAsync=promisify(gzip);
const memory=new Map(),BUDGET=16*1024*1024;let used=0;
const sizeOf=entry=>entry.body.length+Object.values(entry.encoded).reduce((sum,data)=>sum+data.length,0);
function trim(){while(used>BUDGET&&memory.size){const key=memory.keys().next().value;used-=sizeOf(memory.get(key));memory.delete(key);}}
function encoding(header){
  const accepted=new Map(String(header||'').split(',').map(part=>{const [name,...parameters]=part.trim().split(';');const q=parameters.find(p=>p.trim().startsWith('q='));return [name,q?Number(q.trim().slice(2)):1];}));
  return ['br','gzip'].filter(name=>(accepted.get(name)||0)>0).sort((a,b)=>accepted.get(b)-accepted.get(a))[0];
}
export async function serveStatic(req,res,path,types){
  const info=await stat(path);if(!info.isFile())throw Error('No es un archivo');
  const etag=`W/"${info.size.toString(16)}-${info.mtimeMs.toString(16)}"`;
  let entry=memory.get(path);if(entry&&entry.etag!==etag){used-=sizeOf(entry);memory.delete(path);entry=null;}
  const version=new URL(req.url,'http://localhost').searchParams.get('v');
  const extension=extname(path),mime=types[extension]||'application/octet-stream';
  const compressible=/^(text\/|application\/(json|xml|javascript))/.test(mime)||mime==='image/svg+xml';
  const headers={'Content-Type':`${mime}${/^(text\/|application\/json)/.test(mime)?'; charset=utf-8':''}`,'X-Content-Type-Options':'nosniff','ETag':etag,'Last-Modified':info.mtime.toUTCString(),'Cache-Control':'public, max-age=0, must-revalidate'};
  if(path.endsWith('sw.js'))headers['Cache-Control']='no-cache';
  if(compressible)headers.Vary='Accept-Encoding';
  if(entry&&version===entry.hash)headers['Cache-Control']='public, max-age=31536000, immutable';
  if(req.headers['if-none-match']?.split(/\s*,\s*/).includes(etag)){res.writeHead(304,headers);res.end();return;}
  if(req.method==='HEAD'){headers['Content-Length']=info.size;res.writeHead(200,headers);res.end();return;}
  if(!entry){const body=await readFile(path);entry={etag,body,hash:createHash('sha256').update(body).digest('hex').slice(0,12),encoded:{}};if(body.length<=4*1024*1024){memory.set(path,entry);used+=body.length;trim();}}
  else{memory.delete(path);memory.set(path,entry);}
  if(version===entry.hash)headers['Cache-Control']='public, max-age=31536000, immutable';
  let body=entry.body;
  const selected=compressible&&body.length>1024?encoding(req.headers['accept-encoding']):null;
  if(selected){
    if(!entry.encoded[selected]){const compressed=selected==='br'?await brotli(body,{params:{[constants.BROTLI_PARAM_QUALITY]:4}}):await gzipAsync(body);
      if(compressed.length<body.length){entry.encoded[selected]=compressed;if(memory.get(path)===entry){used+=compressed.length;trim();}}
    }
    if(entry.encoded[selected]){body=entry.encoded[selected];headers['Content-Encoding']=selected;}
  }
  headers['Content-Length']=body.length;res.writeHead(200,headers);res.end(body);
}
