(() => {
  'use strict';
  const dialog=document.querySelector('#image-viewer');
  const image=document.querySelector('#viewer-image');
  const viewport=document.querySelector('.viewer-scroll');
  let opener;
  document.addEventListener('click', async event => {
    const button=event.target.closest('[data-open-image]');
    if(!button)return;
    opener=button;image.src=button.dataset.openImage;image.alt=button.dataset.title||'تصویر کامل محیط پهلوان';
    document.querySelector('#viewer-title').textContent=image.alt;
    document.querySelector('#viewer-original').href=button.dataset.openImage;
    viewport.classList.remove('actual');dialog.showModal();
    try{await image.decode();image.style.setProperty('--image-width',image.naturalWidth+'px');viewport.scrollTo(0,0);}catch{}
  });
  document.querySelector('#viewer-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
  document.querySelector('#viewer-fit').addEventListener('click',()=>{viewport.classList.remove('actual');viewport.scrollTo(0,0);});
  document.querySelector('#viewer-actual').addEventListener('click',()=>{viewport.classList.add('actual');viewport.scrollTo(0,0);});
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  const contents=document.querySelector('#contents-dialog');
  const contentsToggle=document.querySelector('#contents-toggle');
  contentsToggle.addEventListener('click',()=>contents.showModal());
  document.querySelector('#contents-close').addEventListener('click',()=>contents.close());
  contents.addEventListener('close',()=>contentsToggle.focus({preventScroll:true}));
  contents.addEventListener('click',event=>{if(event.target.closest('a[href^="#"]'))contents.close();});
  const search=document.querySelector('#feature-search');
  const cards=[...document.querySelectorAll('.feature-card')];
  const normalize=value=>value.normalize('NFKC').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[\u200c\u064b-\u065f]/g,'').toLocaleLowerCase('fa');
  search.addEventListener('input',()=>{
    const query=normalize(search.value.trim());let count=0;
    for(const card of cards){card.hidden=query&&!normalize(card.dataset.search).includes(query);if(!card.hidden)count++;}
    for(const group of document.querySelectorAll('.feature-group'))group.hidden=![...group.querySelectorAll('.feature-card')].some(c=>!c.hidden);
    const status=document.querySelector('.search-status');status.hidden=!query;
    status.textContent=count?`${count.toLocaleString('fa-IR')} قابلیت پیدا شد.`:'قابلیتی با این عبارت پیدا نشد؛ عبارت دیگری بنویسید.';
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='/'&&!dialog.open&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){event.preventDefault();search.focus();}
    if(event.key==='Escape'&&document.activeElement===search&&search.value){search.value='';search.dispatchEvent(new Event('input'));}
  });
  if('IntersectionObserver' in window){
    const nav=[...document.querySelectorAll('.catalog-toolbar nav a')];
    const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){for(const link of nav){const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}}},{rootMargin:'-15% 0px -70% 0px'});
    document.querySelectorAll('.feature-group').forEach(section=>observer.observe(section));
  }
})();
