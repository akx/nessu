var B=Object.defineProperty;var D=(r,e,t)=>e in r?B(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var l=(r,e,t)=>(D(r,typeof e!="symbol"?e+"":e,t),t);import{R as o,u as J,e as U,d as L,a as M}from"./vendor.e9cdf1e3.js";const T=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerpolicy&&(a.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?a.credentials="include":n.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}};T();let i,E=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});E.decode();let b=null;function x(){return(b===null||b.buffer!==i.memory.buffer)&&(b=new Uint8Array(i.memory.buffer)),b}function k(r,e){return E.decode(x().subarray(r,r+e))}let w=0;function R(r,e){const t=e(r.length*1);return x().set(r,t/1),w=r.length,t}let g=null;function v(){return(g===null||g.buffer!==i.memory.buffer)&&(g=new Float32Array(i.memory.buffer)),g}function N(r,e){const t=e(r.length*4);return v().set(r,t/4),w=r.length,t}const p=Object.freeze({Poweroff:0,0:"Poweroff",Reset:1,1:"Reset",Select:2,2:"Select",Start:3,3:"Start",Joypad1A:4,4:"Joypad1A",Joypad1B:5,5:"Joypad1B",Joypad1Up:6,6:"Joypad1Up",Joypad1Down:7,7:"Joypad1Down",Joypad1Left:8,8:"Joypad1Left",Joypad1Right:9,9:"Joypad1Right",Joypad2A:10,10:"Joypad2A",Joypad2B:11,11:"Joypad2B",Joypad2Up:12,12:"Joypad2Up",Joypad2Down:13,13:"Joypad2Down",Joypad2Left:14,14:"Joypad2Left",Joypad2Right:15,15:"Joypad2Right"});class A{static __wrap(e){const t=Object.create(A.prototype);return t.ptr=e,t}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();i.__wbg_wasmnes_free(e)}static new(){var e=i.wasmnes_new();return A.__wrap(e)}set_rom(e){var t=R(e,i.__wbindgen_malloc),s=w;i.wasmnes_set_rom(this.ptr,t,s)}bootup(){i.wasmnes_bootup(this.ptr)}reset(){i.wasmnes_reset(this.ptr)}step(){i.wasmnes_step(this.ptr)}step_frame(){i.wasmnes_step_frame(this.ptr)}update_pixels(e){try{var t=R(e,i.__wbindgen_malloc),s=w;i.wasmnes_update_pixels(this.ptr,t,s)}finally{e.set(x().subarray(t/1,t/1+s)),i.__wbindgen_free(t,s*1)}}update_sample_buffer(e){try{var t=N(e,i.__wbindgen_malloc),s=w;i.wasmnes_update_sample_buffer(this.ptr,t,s)}finally{e.set(v().subarray(t/4,t/4+s)),i.__wbindgen_free(t,s*4)}}press_button(e){i.wasmnes_press_button(this.ptr,e)}release_button(e){i.wasmnes_release_button(this.ptr,e)}}async function O(r,e){if(typeof Response=="function"&&r instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(r,e)}catch(s){if(r.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",s);else throw s}const t=await r.arrayBuffer();return await WebAssembly.instantiate(t,e)}else{const t=await WebAssembly.instantiate(r,e);return t instanceof WebAssembly.Instance?{instance:t,module:r}:t}}async function C(r){typeof r=="undefined"&&(r=new URL("/nessu/assets/nes_rust_wasm_bg.1dce5c40.wasm",self.location));const e={};e.wbg={},e.wbg.__wbindgen_throw=function(n,a){throw new Error(k(n,a))},(typeof r=="string"||typeof Request=="function"&&r instanceof Request||typeof URL=="function"&&r instanceof URL)&&(r=fetch(r));const{instance:t,module:s}=await O(await r,e);return i=t.exports,C.__wbindgen_wasm_module=s,i}const F={Space:p.Start,ArrowLeft:p.Joypad1Left,ArrowRight:p.Joypad1Right,ArrowUp:p.Joypad1Up,ArrowDown:p.Joypad1Down,KeyA:p.Joypad1A,KeyB:p.Joypad1B,KeyS:p.Select};class I{constructor(e,t){l(this,"canvas");l(this,"nes");l(this,"ctx");l(this,"imageData");l(this,"pixels");l(this,"audioContext");l(this,"lastUpdateTime",0);l(this,"UPDATE_RATE",1e3/60);l(this,"crash",null);l(this,"handleKeyEvent",e=>{const t=F[e.code];return!t||this.crash?!1:(e.type==="keydown"?this.nes.press_button(t):this.nes.release_button(t),this.audioContext.resume(),!0)});l(this,"stepFrame",e=>{if(!(e-this.lastUpdateTime<this.UPDATE_RATE)){if(this.lastUpdateTime=e,this.crash)for(let t=0;t<256;t++){const s=Math.floor(Math.random()*(this.pixels.length-1)),n=this.pixels[s];this.pixels[s]=this.pixels[s]+1,this.pixels[s]=n+1}else try{this.nes.step_frame(),this.nes.update_pixels(this.pixels)}catch(t){this.crash={phase:"exec",error:t}}this.ctx.putImageData(this.imageData,0,0)}});this.canvas=e,this.audioContext=this.setupAudio(),this.nes=A.new();try{this.nes.set_rom(new Uint8Array(t))}catch(n){this.crash={phase:"load",error:n}}const s=e.getContext("2d");if(!s)throw new Error("oh no");this.ctx=s,this.imageData=s.createImageData(256,240),this.pixels=new Uint8Array(this.imageData.data.buffer)}setupAudio(){const e=new AudioContext({sampleRate:44100}),t=4096,s=e.createScriptProcessor(t,0,1);return s.onaudioprocess=n=>{if(this.crash)return;const a=n.outputBuffer.getChannelData(0);try{this.nes.update_sample_buffer(a)}catch(c){this.crash={phase:"audio",error:c}}for(let c=0;c<a.length;c++)a[c]*=.6},s.connect(e.destination),e}boot(){for(let e=0;e<this.pixels.length;e++)this.pixels[e]=e%4==3?255:e%256;this.ctx.putImageData(this.imageData,0,0);try{this.nes.bootup()}catch(e){this.crash={phase:"boot",error:e}}}stop(){if(this.audioContext.close(),!this.crash)try{this.nes.free()}catch(e){this.crash={phase:"stop",error:e}}}}function W(r){const e=o.useRef(null),t=o.useCallback(a=>{var c;((c=e.current)==null?void 0:c.handleKeyEvent(a))&&a.preventDefault()},[]);J("keydown",t,window),J("keyup",t,window);const s=o.useCallback(a=>{var c;e.current&&((c=e.current)==null||c.stepFrame(a),requestAnimationFrame(s))},[]);return{bootArrayBuffer:o.useCallback(a=>{var m;e.current&&((m=e.current)==null||m.stop(),e.current=null);const c=r.current;if(c){const h=new I(c,a);h.boot(),e.current=h,s(0)}},[])}}function P(){const r=o.useRef(null),e=o.useRef(null),[t,s]=o.useState(5e-4),[n,a]=o.useState({}),{bootArrayBuffer:c}=W(r),m=o.useCallback(u=>{const f={corruption:t,xor:0,add:0},d=u.slice(0),y=new Uint8Array(d);for(let _=0;_<y.length;_++)Math.random()<t&&(Math.random()<.2?(y[_]^=Math.random()*256,f.xor++):(y[_]++,f.add++));return[d,f]},[t]),h=o.useCallback(()=>{const u=e.current;if(!u)return;const[f,d]=m(u);a(d),c(f)},[m]),S=o.useCallback(async u=>{var y;const f=(y=u.target.files)==null?void 0:y[0];if(!f)return;const d=await f.arrayBuffer();localStorage.setItem("nessu-last-rom",U(d)),e.current=d,h()},[]);return o.useEffect(()=>{const u=localStorage.getItem("nessu-last-rom");u&&(e.current=L(u),h())},[]),o.createElement("div",{className:"App"},o.createElement("div",{className:"controls"},o.createElement("div",null,"Select a NES ROM file:\xA0",o.createElement("input",{type:"file",onChange:S})),o.createElement("div",null,"Corruption factor:",o.createElement("input",{type:"range",min:0,max:.1,step:1e-6,value:t,onChange:u=>s(u.target.valueAsNumber)}),(t*100).toPrecision(2),"%"),o.createElement("div",null,JSON.stringify(n)),o.createElement("button",{onClick:h},"Restart")),o.createElement("div",{className:"display"},o.createElement("canvas",{ref:r,width:"256",height:"240",style:{width:"768px",imageRendering:"pixelated"}}),"Controls: arrows / A / B / space (start)"))}async function K(){await C(),M.render(o.createElement(o.StrictMode,null,o.createElement(P,null)),document.getElementById("root"))}K();
