const pane=document.querySelector('.reader-pane'), wraps=[...document.querySelectorAll('.page-wrap')], index=document.querySelector('.reader-index'), zoom=document.querySelector('#zoom');
let page=1,quiet=false;
const fa=n=>n.toLocaleString('fa-IR');
function announce(n){page=n;document.querySelector('.page-counter').textContent=fa(page)+' / '+fa(wraps.length);document.querySelectorAll('.reader-index a').forEach(a=>{if(a.hash==='#page-'+page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});document.querySelector('#previous').disabled=page===1;document.querySelector('#next').disabled=page===wraps.length;history.replaceState(null,'','#page-'+page);}
function goto(n){n=Math.max(1,Math.min(wraps.length,n));quiet=true;pane.scrollTop=wraps[n-1].offsetTop-pane.offsetTop;announce(n);requestAnimationFrame(()=>quiet=false);}
function setZoom(){const fit=Math.max(.15,Math.min(1,(pane.clientWidth-(innerWidth<640?28:48))/1200));const value=zoom.value==='fit'?fit:Number(zoom.value);document.documentElement.style.setProperty('--zoom',value);goto(page);}
zoom.addEventListener('change',setZoom);window.addEventListener('resize',setZoom);
document.querySelector('#previous').addEventListener('click',()=>goto(page-1));document.querySelector('#next').addEventListener('click',()=>goto(page+1));
index.addEventListener('click',e=>{const a=e.target.closest('a[href^="#page-"]');if(!a)return;e.preventDefault();goto(Number(a.hash.split('-').at(-1)));index.classList.remove('open');document.querySelector('.reader-menu').setAttribute('aria-expanded','false');});
document.querySelector('.reader-menu').addEventListener('click',e=>{const open=index.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));});
document.querySelector('#index-search').addEventListener('input',e=>{const q=e.target.value.trim();for(const a of index.querySelectorAll('a'))a.hidden=!a.textContent.includes(q);});
pane.addEventListener('scroll',()=>{if(quiet)return;const y=pane.scrollTop+pane.offsetTop+pane.clientHeight*.28;let n=1;for(let i=0;i<wraps.length;i++)if(wraps[i].offsetTop<=y)n=i+1;announce(n);},{passive:true});
document.addEventListener('keydown',e=>{if(e.target.matches('input,select,button')||document.querySelector('dialog[open]'))return;if(e.key==='PageDown'){e.preventDefault();goto(page+1);}if(e.key==='PageUp'){e.preventDefault();goto(page-1);}if(e.key==='Escape'){index.classList.remove('open');document.querySelector('.reader-menu').setAttribute('aria-expanded','false');}});
const initial=Number(location.hash.match(/^#page-(\d+)$/)?.[1]||1);announce(Math.max(1,Math.min(wraps.length,initial)));setZoom();
addEventListener('hashchange',()=>goto(Number(location.hash.match(/\d+/)?.[0]||1)));
