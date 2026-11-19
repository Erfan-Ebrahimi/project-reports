const dialog=document.querySelector('#image-dialog');
document.addEventListener('click',e=>{const button=e.target.closest('[data-image]');if(!button)return;const img=dialog.querySelector('img');img.src=button.dataset.image;img.alt=button.dataset.title;dialog.querySelector('strong').textContent=button.dataset.title;dialog.showModal();});
dialog?.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
const search=document.querySelector('#feature-search');
search?.addEventListener('input',()=>{const q=search.value.trim().toLocaleLowerCase('fa');let count=0;for(const card of document.querySelectorAll('.feature')){card.hidden=!card.textContent.toLocaleLowerCase('fa').includes(q);if(!card.hidden)count++;}for(const group of document.querySelectorAll('.group'))group.hidden=![...group.querySelectorAll('.feature')].some(x=>!x.hidden);document.querySelector('#search-count').textContent=count.toLocaleString('fa-IR')+' قابلیت';document.querySelector('.empty-search').hidden=count!==0;});
