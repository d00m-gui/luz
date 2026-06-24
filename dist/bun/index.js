import{a as u}from"../shared/chunk-wm1ap0jw.js";import{b as e,c as s,d as m}from"../shared/chunk-vnwb157f.js";import{e as r}from"../shared/chunk-c7ccvmgn.js";var P=(t)=>{let{variables:a,tokens:o}=r(t),p=t.path??"./";return{name:"luz",setup(i){i.onEnd(async()=>{let l=`
					${m()}
					${e(o)}
					:root {
						${a}
					}
					${s(o)}`,c=u(l),n=`${p}/luz.css`;await Bun.write(n,c),console.log(`[luz] CSS created @ '${n}'`)})}}};export{P as luzPlugin};
