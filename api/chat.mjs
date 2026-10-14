import {handleChat} from '../server/chat.mjs';
const visitors=new Map();
const send=(res,status,data)=>{
  res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));
};
export async function vercelChat(req,res,options={}){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return send(res,405,{error:'Método no permitido.'});}
  // Límite por instancia cálida. Para un límite global, utilizar Vercel Firewall.
  const now=Date.now(),ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
  for(const [key,entry]of visitors)if(entry.until<now)visitors.delete(key);
  const entry=visitors.get(ip)||{count:0,until:now+60000};visitors.set(ip,entry);
  if(++entry.count>12){res.setHeader('Retry-After','60');return send(res,429,{error:'Demasiadas consultas. Espera un minuto.'});}
  try{
    let body;
    if(req.body!==undefined&&req.body!==null)body=typeof req.body==='string'?req.body:JSON.stringify(req.body);
    else{
      const chunks=[];let size=0;for await(const chunk of req){const buffer=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);size+=buffer.length;if(size>24000)return send(res,413,{error:'La conversación es demasiado larga.'});chunks.push(buffer);}body=Buffer.concat(chunks).toString('utf8');
    }
    if(Buffer.byteLength(body)>24000)return send(res,413,{error:'La conversación es demasiado larga.'});
    const host=String(req.headers['x-forwarded-host']||req.headers.host||'localhost').split(',')[0].trim();
    const protocol=String(req.headers['x-forwarded-proto']||'https').split(',')[0].trim()==='http'?'http':'https';
    const headers=new Headers();for(const [key,value]of Object.entries(req.headers))if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(','):String(value));
    const result=await handleChat(new Request(`${protocol}://${host}/api/chat`,{method:'POST',headers,body}),options);
    res.statusCode=result.status;for(const [key,value]of result.headers)res.setHeader(key,value);res.end(await result.text());
  }catch{return send(res,502,{error:'No se pudo procesar la consulta. Intenta nuevamente.'});}
}
export default function handler(req,res){return vercelChat(req,res);}
