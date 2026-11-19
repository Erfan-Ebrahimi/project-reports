(() => {
 'use strict';
 const root=document.documentElement;
 const scroll=document.querySelector('.reader-scroll');
 const wraps=[...document.querySelectorAll('.reader-page-wrap')];
 const pages=[...document.querySelectorAll('.print-page')];
 const links=[...document.querySelectorAll('[data-reader-link]')];
 const number=document.querySelector('#reader-page-number');
 const zoom=document.querySelector('#reader-zoom');
 const menu=document.querySelector('#reader-menu');
 const toggle=document.querySelector('#reader-menu-open');
 let active=1;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function select(page,updateHash=true){
  active=page;number.value=page;
  document.querySelector('#reader-previous').disabled=page===1;
  document.querySelector('#reader-next').disabled=page===pages.length;
  for(const link of links){if(Number(link.dataset.page)===page)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
  if(updateHash)history.replaceState(null,'','#page-'+page);
 }
 function go(page,behavior='smooth'){
  page=Math.max(1,Math.min(pages.length,Number(page)||1));select(page);
  const target=wraps[page-1];scroll.scrollTo({top:target.offsetTop-wraps[0].offsetTop,behavior:reduced()?'instant':behavior});
 }
 function fit(){
  const scale=zoom.value==='fit'?Math.min((scroll.clientWidth-(innerWidth<=760?16:48))/1600,1):Number(zoom.value);
  root.style.setProperty('--reader-scale',scale);
  root.style.setProperty('--reader-width',1600*scale+'px');
  root.style.setProperty('--reader-height',1100*scale+'px');
  root.style.setProperty('--reader-end-space',Math.max(24,scroll.clientHeight-1100*scale)+'px');
 }
 document.querySelector('#reader-previous').addEventListener('click',()=>go(active-1));
 document.querySelector('#reader-next').addEventListener('click',()=>go(active+1));
 number.addEventListener('change',()=>go(number.value));
 zoom.addEventListener('change',()=>{fit();go(active,'instant');});
 const observer=new ResizeObserver(()=>{const page=active;fit();go(page,'instant');});observer.observe(scroll);
 for(const link of links)link.addEventListener('click',event=>{event.preventDefault();if(menu.open)menu.close();go(link.dataset.page);});
 toggle.addEventListener('click',()=>menu.showModal());
 document.querySelector('#reader-menu-close').addEventListener('click',()=>menu.close());
 menu.addEventListener('close',()=>toggle.focus({preventScroll:true}));
 const normalize=s=>s.normalize('NFKC').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[\u200c\u064b-\u065f]/g,'').toLocaleLowerCase('fa');
 for(const search of document.querySelectorAll('[data-reader-search]'))search.addEventListener('input',()=>{
  const scope=search.closest('.reader-sidebar-content,.reader-menu-content');const query=normalize(search.value.trim());let count=0;
  for(const link of scope.querySelectorAll('[data-reader-link]')){link.hidden=query&&!normalize(link.dataset.search).includes(query);if(!link.hidden)count++;}
  for(const group of scope.querySelectorAll('details')){group.hidden=![...group.querySelectorAll('[data-reader-link]')].some(l=>!l.hidden);if(query&&!group.hidden)group.open=true;}
  scope.querySelector('.reader-no-results').hidden=count>0;
 });
 let ticking=false;
 scroll.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;const y=scroll.getBoundingClientRect().top+scroll.clientHeight*.3;let page=1;for(let i=0;i<wraps.length;i++){if(wraps[i].getBoundingClientRect().top<=y)page=i+1;}select(page);});},{passive:true});
 document.addEventListener('keydown',event=>{if(menu.open||/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))return;if(['ArrowDown','PageDown','ArrowUp','PageUp'].includes(event.key)){event.preventDefault();go(active+(['ArrowDown','PageDown'].includes(event.key)?1:-1));}});
 const initial=Number(location.hash.replace('#page-',''))||1;
 fit();go(initial,'instant');
 document.fonts.ready.then(()=>{fit();go(initial,'instant');});
})();
