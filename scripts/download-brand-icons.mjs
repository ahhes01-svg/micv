import {mkdir,writeFile,readFile} from 'node:fs/promises';
const dir=new URL('../assets/images/technologies/',import.meta.url);
await mkdir(dir,{recursive:true});
const colors={javascript:'#F7DF1E',react:'#61DAFB',typescript:'#3178C6',css3:'#1572B6',html5:'#E34F26',claude:'#D97757',openai:'#10A37F',python:'#3776AB',wordpress:'#21759B',php:'#777BB4',powerbi:'#F2C811',microsoftexcel:'#217346',lucidchart:'#F96B13'};
const aliases={powerbi:['https://raw.githubusercontent.com/simple-icons/simple-icons/11.0.0/icons/powerbi.svg'],microsoftexcel:['https://raw.githubusercontent.com/simple-icons/simple-icons/11.0.0/icons/microsoftexcel.svg'],lucidchart:['https://raw.githubusercontent.com/simple-icons/simple-icons/13.0.0/icons/lucid.svg','https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/lucidchart.svg']};
const selected=process.argv.slice(2);
const sources=await readFile(new URL('sources.json',dir),'utf8').then(JSON.parse).catch(()=>[]);
const results=await Promise.allSettled(Object.entries(colors).filter(([name])=>!selected.length||selected.includes(name)).map(async([name,color])=>{
 const urls=name==='claude'?[
  'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/claude.svg',
  'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/claude.svg'
 ]:aliases[name]||[`https://raw.githubusercontent.com/simple-icons/simple-icons/13.0.0/icons/${name}.svg`];
 for(const url of urls){const response=await fetch(url);if(!response.ok)continue;const svg=await response.text();if(!svg.includes('<svg'))continue;
  const filled=svg.replace('<svg ',`<svg fill="${color}" `);
  await writeFile(new URL(`${name}.svg`,dir),filled);const old=sources.findIndex(source=>source.name===name);if(old>=0)sources.splice(old,1);sources.push({name,url});return name;
 }
 throw Error(`Logo no disponible: ${name}`);
}));
for(const result of results){if(result.status==='fulfilled')console.log('Logo: '+result.value);else console.log(result.reason.message);}
await writeFile(new URL('sources.json',dir),JSON.stringify(sources,null,2));
if(results.some(result=>result.status==='rejected'))process.exitCode=1;
