(()=>{
  const wait=()=>{
    if(typeof openEmployee!=='function'||typeof db==='undefined'||typeof by!=='function'||typeof save!=='function') return setTimeout(wait,50);
    if(window.__hmlBankFlowV4) return;
    window.__hmlBankFlowV4=1;

    const today=()=>new Date().toISOString().slice(0,10);
    const opts=(items,selected)=>'<option value="">—</option>'+items.map(x=>`<option value="${x.id}" ${x.id===selected?'selected':''}>${x.name}</option>`).join('');
    const bankOptions=s=>opts(db.banks,s);
    const branchOptions=(bankId,s)=>opts(db.branches.filter(x=>!bankId||x.bankId===bankId),s);
    const current=e=>Array.isArray(e.bankAccounts)?(e.bankAccounts.find(x=>x.current)||e.bankAccounts.find(x=>!x.endDate)||e.bankAccounts[0]||null):null;
    const syncLegacy=(e,a)=>{e.bankId=a?.bankId||'';e.branchId=a?.branchId||'';e.account=a?.account||'';e.accountHolder=a?.holder||''};

    function ensure(e){
      if(!Array.isArray(e.bankAccounts)){
        e.bankAccounts=[];
        if(e.bankId||e.branchId||e.account||e.accountHolder)e.bankAccounts.push({id:'ba_'+Date.now(),bankId:e.bankId||'',branchId:e.branchId||'',account:e.account||'',holder:e.accountHolder||'',startDate:'',endDate:'',current:true});
      }
      e.bankAccounts=e.bankAccounts.filter(x=>x.bankId||x.branchId||x.account||x.holder);
    }

    function alertBox(msg){
      let el=document.getElementById('hmlBankAlert');
      if(!el){el=document.createElement('div');el.id='hmlBankAlert';el.style.cssText='display:none;margin:0 0 14px;padding:11px 13px;border-radius:10px;background:#fff4f4;border:1px solid #e6aaaa;color:#a22;font-weight:700';const main=drawerBody.querySelector('.employee-detail-main')||drawerBody;main.prepend(el)}
      el.textContent=msg;el.style.display='block';
    }
    function clearErrors(){document.querySelectorAll('.hml-bank-invalid').forEach(el=>{el.classList.remove('hml-bank-invalid');el.style.borderColor=''})}
    function markInvalid(el){if(el){el.classList.add('hml-bank-invalid');el.style.borderColor='#d94848'}}

    function render(e,mode='view'){
      ensure(e);save();
      const a=current(e);
      const main=drawerBody.querySelector('.employee-detail-main')||drawerBody;
      const adding=mode==='add';
      const form=adding?{bankId:'',branchId:'',account:'',holder:'',startDate:today()}:a;
      const rows=e.bankAccounts.map((x,i)=>{const b=by(db.banks,x.bankId),br=by(db.branches,x.branchId);return `<div class="hml-bank-row ${x.current?'hml-current':''}"><div><b>${b?.name||'銀行未設定'}</b><div class="muted">${br?.name||'支店未設定'}</div></div><div><b>口座番号</b><div class="muted">${x.account||'—'}</div></div><div><b>口座名義</b><div class="muted">${x.holder||'—'}</div></div><div><b>適用期間</b><div class="muted">${x.startDate||'—'} ～ ${x.current?'現在':(x.endDate||'—')}</div></div><div>${x.current?'<span class="hml-badge">現在使用中</span>':`<button class="btn mini" onclick="hmlV4SetCurrent('${e.id}',${i})">現在の口座にする</button>`}</div></div>`}).join('');
      main.innerHTML=`<div id="hmlBankAlert" style="display:none;margin:0 0 14px;padding:11px 13px;border-radius:10px;background:#fff4f4;border:1px solid #e6aaaa;color:#a22;font-weight:700"></div><div class="hml-bank-card"><div class="hml-bank-head"><div><h3 style="margin:0">${adding?'新しい振込口座':'現在の振込口座'}</h3><div class="muted">${adding?'必要事項を入力して、もう一度「+ 口座を追加」を押してください。':'現在有効な振込先'}</div></div>${!adding&&a?'<span class="hml-badge">現在使用中</span>':''}</div>${form?`<div class="hml-bank-grid"><div class="field"><label>銀行 *</label><select id="hmlv4_bank" ${adding?'':'disabled'}>${bankOptions(form.bankId||'')}</select></div><div class="field"><label>支店 *</label><select id="hmlv4_branch" ${adding?'':'disabled'}>${branchOptions(form.bankId||'',form.branchId||'')}</select></div><div class="field"><label>口座番号 *</label><input id="hmlv4_account" value="${form.account||''}" ${adding?'':'readonly'}></div><div class="field"><label>口座名義 *</label><input id="hmlv4_holder" value="${form.holder||''}" ${adding?'':'readonly'}></div><div class="field"><label>適用開始日 *</label><input type="date" id="hmlv4_start" value="${form.startDate||today()}" ${adding?'':'readonly'}></div></div>`:'<div class="muted">振込口座は登録されていません。</div>'}</div><div class="hml-section-head"><h3 style="margin:0">口座履歴</h3><button class="btn primary" id="hmlv4AddBtn">+ 口座を追加</button></div><div>${rows||'<div class="muted">口座履歴はありません。</div>'}</div>`;
      const bank=document.getElementById('hmlv4_bank');
      if(adding&&bank)bank.onchange=()=>{document.getElementById('hmlv4_branch').innerHTML=branchOptions(bank.value,'')};
      document.getElementById('hmlv4AddBtn').onclick=()=>adding?commitAdd(e):render(e,'add');
      drawerFoot.innerHTML='<button class="btn" onclick="closeDrawer()">閉じる</button>';
    }

    function commitAdd(e){
      clearErrors();
      const bank=document.getElementById('hmlv4_bank'),branch=document.getElementById('hmlv4_branch'),account=document.getElementById('hmlv4_account'),holder=document.getElementById('hmlv4_holder'),start=document.getElementById('hmlv4_start');
      const missing=[];
      if(!bank?.value){missing.push('銀行');markInvalid(bank)}
      if(!branch?.value){missing.push('支店');markInvalid(branch)}
      if(!account?.value.trim()){missing.push('口座番号');markInvalid(account)}
      if(!holder?.value.trim()){missing.push('口座名義');markInvalid(holder)}
      if(!start?.value){missing.push('適用開始日');markInvalid(start)}
      if(missing.length){alertBox('必須項目を入力してください：'+missing.join('・'));return}
      ensure(e);
      const prev=current(e);if(prev){prev.current=false;if(!prev.endDate)prev.endDate=start.value}
      const a={id:'ba_'+Date.now(),bankId:bank.value,branchId:branch.value,account:account.value.trim(),holder:holder.value.trim(),startDate:start.value,endDate:'',current:true};
      e.bankAccounts.push(a);syncLegacy(e,a);const now=new Date().toISOString();e.history=e.history||[];e.history.push({date:now,text:'振込口座情報を更新'});e.updatedAt=now;e.updatedText='振込口座情報を更新';save();render(e,'view');
      if(typeof showSavedStatus==='function')showSavedStatus();
    }

    window.hmlV4SetCurrent=(id,i)=>{const e=by(db.employees,id);ensure(e);const a=e.bankAccounts[i];if(!a)return;const prev=current(e);if(prev&&prev!==a){prev.current=false;if(!prev.endDate)prev.endDate=today()}a.current=true;a.endDate='';if(!a.startDate)a.startDate=today();syncLegacy(e,a);save();render(e,'view')};

    const prevOpen=openEmployee;
    openEmployee=function(id,tab='dados'){
      prevOpen(id,tab);
      const e=by(db.employees,id);if(!e)return;
      setTimeout(()=>{if(tab==='pagamento')render(e,'view')},80);
    };
  };
  wait();
})();