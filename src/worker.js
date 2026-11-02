import { pipeline, env } from '@huggingface/transformers';
env.allowRemoteModels = true;
const MODEL='onnx-community/SmolLM2-135M-Instruct';
let generator=null;
self.onmessage=async({data})=>{
 try {
  if(data.type==='load'){
   if(!generator) generator=await pipeline('text-generation',MODEL,{device:'wasm',dtype:'q8',progress_callback:(p)=>{if(p.status==='progress'&&p.total) self.postMessage({type:'progress',message:`Downloading ${p.file||'model'}: ${Math.round(p.progress||p.loaded/p.total*100)}%`});else if(p.status)self.postMessage({type:'progress',message:`${p.status}: ${p.file||'model'}`});}});
   self.postMessage({type:'ready'});
  }
  if(data.type==='ask'){
   if(!generator)throw Error('Load the model first');
   const output=await generator([{role:'user',content:data.question}],{max_new_tokens:80,do_sample:false});
   const generated=output[0]?.generated_text;
   const text=Array.isArray(generated)?generated.at(-1)?.content:String(generated||'No response');
   self.postMessage({type:'response',text});
  }
 }catch(err){self.postMessage({type:'error',message:err?.message||String(err)})}
};
