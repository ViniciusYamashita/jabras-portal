(()=>{
  const wait=()=>{
    if(typeof openEmployee!=='function'||typeof db==='undefined'||typeof by!=='function'||typeof save!=='function'||typeof hmlAddBank!=='function') return setTimeout(wait,50);
    if(window.__hmlBankFixV2) return;
    window.__hmlBankFixV2=1;
    let draftEmployeeId=null;
    const today=()=>new Date().toISOString().slice(0,10);
    const emptyAccount=a=>!a?.bankId&&!a?.branchId&&!a?.account&&!a?.holder;
    const syncLegacy=(e,a)=>{e.bankId=a?.bankId||'';e.branchId=a?.branchId||'';e.account=a?.account||'';e.accountHolder=a?.holder||''};
    function cleanup(e){
      if(!Array.isArray(e.bankAccounts)) return;
      const before=e.bankAccounts.length;
      e.bankAccounts=e.bankAccounts.filter(a=>!emptyAccount(a));
      if(e.bankAccounts.length&&!e.bankAccounts.some(a=>a.current)){
        const a=e.bankAccounts[e.bankAccounts.length-1];a.current=true;a.endDate='';syncLegacy(e,a);
      }
      if(before!==e.bankAccounts.length) save();
    }
    function blankEditor(){
      const ids=['hml_bank','hml_branch','hml_account','hml_holder'];
      ids.forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});
      const start=document.getElementById('hml_start');if(start)start.value=today();
      const card=document.querySelector('.hml-bank-card');
      if(card){
        const h=card.querySelector('h3');if(h)h.textContent='新しい振込口座';
        const badge=card.querySelector('.hml-badge');if(badge)badge.textContent='未保存';
      }
    }
    window.hmlAddBank=id=>{
      const e=by(db.employees,id);if(!e)return;
      cleanup(e);draftEmployeeId=id;
      openEmployee(id,'pagamento');
      setTimeout(blankEditor,80);
    };
    window.hmlSaveBank=id=>{
      const e=by(db.employees,id);if(!e)return;
      cleanup(e);
      const bankId=document.getElementById('hml_bank')?.value||'';
      const branchId=document.getElementById('hml_branch')?.value||'';
      const account=document.getElementById('hml_account')?.value.trim()||'';
      const holder=document.getElementById('hml_holder')?.value.trim()||'';
      const startDate=document.getElementById('hml_start')?.value||today();
      if(!bankId||!branchId||!account||!holder){
        if(typeof systemNotice==='function') systemNotice('銀行・支店・口座番号・口座名義を入力してください。');
        return;
      }
      if(!Array.isArray(e.bankAccounts)) e.bankAccounts=[];
      if(draftEmployeeId===id){
        e.bankAccounts.forEach(a=>{if(a.current){a.current=false;if(!a.endDate)a.endDate=startDate}});
        const a={id:'ba_'+Date.now(),bankId,branchId,account,holder,startDate,endDate:'',current:true};
        e.bankAccounts.push(a);syncLegacy(e,a);draftEmployeeId=null;
      }else{
        let a=e.bankAccounts.find(x=>x.current);
        if(!a){a={id:'ba_'+Date.now(),current:true};e.bankAccounts.push(a)}
        Object.assign(a,{bankId,branchId,account,holder,startDate,endDate:'',current:true});syncLegacy(e,a);
      }
      const now=new Date().toISOString();e.history=e.history||[];e.history.push({date:now,text:'振込口座情報を更新'});e.updatedAt=now;e.updatedText='振込口座情報を更新';save();
      openEmployee(id,'pagamento');
      if(typeof showSavedStatus==='function')showSavedStatus();
    };
    const prevOpen=openEmployee;
    openEmployee=function(id,tab='dados'){
      const e=by(db.employees,id);if(e&&tab==='pagamento')cleanup(e);
      prevOpen(id,tab);
      if(tab==='pagamento'&&draftEmployeeId===id)setTimeout(blankEditor,100);
    };
  };
  wait();
})();