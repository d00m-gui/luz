function k(f){return f.replace(/>[\r\n ]+</g,"").replace(/(<.*?>)|\s+/g,(j,b)=>b?b:" ").trim()}
export{k as a};
