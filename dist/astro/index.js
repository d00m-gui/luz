import{a as n,b as u,c}from"../shared/chunk-cekdh3ge.js";import{d as e}from"../shared/chunk-64xhm90g.js";function m(t){return t.replace(/>[\r\n ]+</g,"").replace(/(<.*?>)|\s+/g,(r,o)=>o?o:" ").trim()}import{writeFileSync as i}from"node:fs";var y=(t)=>{return{name:"luz",hooks:{"astro:server:setup":()=>{let{variables:r,tokens:o}=e(t),f=`
						${n()}
						${u(o)}
						:root {
							${r}
						}
						${c(o)}
						`,S=m(f),s=o.path??"./src/styles/luz.css";i(s,S,{encoding:"utf-8"}),console.log(`[luz] CSS created @ '${s}'`)}}}};export{y as luzAstro};
