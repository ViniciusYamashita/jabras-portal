(()=>{
  const wait=()=>{
    if(!window.__hmlBankFlowV4||typeof db==='undefined'||typeof save!=='function') return setTimeout(wait,60);
    if(window.__hmlBankFlowV5)return;window.__hmlBankFlowV5=1;
    const todayLocal=()=>{const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
    const enhance=()=>{
      const start=document.getElementById('hmlv4_start');
      if(start&&!start.disabled&&!start.readOnly){
        const t=todayLocal();start.min=t;if(!start.value||start.value<t)start.value=t;
        start.addEventListener('change',()=>{if(start.value&&start.value<t){start.value=t;start.style.borderColor='#d94848';let a=document.getElementById('hmlBankAlert');if(a){a.textContent='適用開始日は本日以降の日付を選択してください。';a.style.display='block'}}});
      }
      const heading=[...document.querySelectorAll('h3')].find(x=>x.textContent.trim()==='口座履歴');
      if(heading){const container=heading.parentElement?.nextElementSibling;if(container){const rows=[...container.querySelectorAll('.hml-bank-row')];rows.sort((a,b)=>{const da=(a.textContent.match(/\d{4}-\d{2}-\d{2}/)||['0000-00-00'])[0],dbb=(b.textContent.match(/\d{4}-\d{2}-\d{2}/)||['0000-00-00'])[0];const ca=a.classList.contains('hml-current')?1:0,cb=b.classList.contains('hml-current')?1:0;return cb-ca||dbb.localeCompare(da)}).forEach(r=>container.appendChild(r));}}
    };
    const mo=new MutationObserver(enhance);mo.observe(document.body,{childList:true,subtree:true});enhance();
    document.addEventListener('click',e=>{if(e.target?.id==='hmlv4AddBtn')setTimeout(enhance,0)},true);
  };wait();
})();