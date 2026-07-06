import{a as u,b as e,c}from"../shared/chunk-cekdh3ge.js";import{d as n}from"../shared/chunk-6dv58rrf.js";function s(t){return t.replace(/>[\r\n ]+</g,"").replace(/(<.*?>)|\s+/g,(r,o)=>o?o:" ").trim()}import{writeFileSync as S}from"node:fs";var v=(t)=>{return{name:"luz",hooks:{"astro:build:done":()=>{let{variables:r,tokens:o}=n(t),f=`
						${u()}
						${e(o)}
						:root {
							${r}
						}
						${c(o)}
						`,i=s(f),m=o.path??"./src/styles/luz.css";S(m,i,{encoding:"utf-8"}),console.log(`[luz] CSS created @ '${m}'`)}}}};export{v as luzAstro};
