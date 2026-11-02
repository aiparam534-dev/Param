import './style.css';
const $ = (s) => document.querySelector(s);
const chat = $('#chat'), status = $('#status'), progress = $('#progress');
let ready = false, busy = false;
const worker = new Worker(new URL('./worker.js', import.meta.url), {type:'module'});
function add(role, content) { const node=document.createElement('div'); node.className=`message ${role}`; node.textContent=content; chat.append(node); chat.scrollTop=chat.scrollHeight; return node; }
function setBusy(v) {busy=v; $('#send').disabled=!ready||busy; $('#load').disabled=busy||ready;}
worker.onmessage=({data})=>{
 if(data.type==='progress'){progress.textContent=data.message;}
 if(data.type==='ready'){ready=true;setBusy(false);status.textContent='Local AI ready';progress.textContent='Model loaded on this device. Disconnect internet to test offline inference.';}
 if(data.type==='response'){add('assistant',data.text);setBusy(false);progress.textContent='Generated locally on your iPad.';}
 if(data.type==='error'){add('assistant',`Error: ${data.message}`);status.textContent='Error';setBusy(false);progress.textContent='Try reloading, or check browser storage and memory.';}
};
$('#load').onclick=()=>{setBusy(true);status.textContent='Loadingâ¦';progress.textContent='Downloading model / initializing WASMâ¦';worker.postMessage({type:'load'});};
$('#form').onsubmit=e=>{e.preventDefault();if(!ready||busy)return;const input=$('#prompt');const question=input.value.trim();if(!question)return;add('user',question);input.value='';setBusy(true);progress.textContent='Generating locallyâ¦';worker.postMessage({type:'ask',question});};
$('#clear').onclick=()=>{chat.innerHTML='';add('assistant','Chat cleared. The model remains loaded.');};
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(console.warn));
