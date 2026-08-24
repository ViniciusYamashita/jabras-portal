(()=>{
  const wait=()=>{
    if(typeof openEmployee!=='function'||typeof db==='undefined'||typeof by!=='function'||typeof save!=='function') return setTimeout(wait,50);
    if(window.__hmlRuntimeV1) return;
    window.__hmlRuntimeV1=1;

    const css=document.createElement('style');
    css.textContent=`
      .hml-bank-card{border:1px solid var(--line);border-radius:14px;padding:16px;background:#fff;margin-bottom:16px}
      .hml-bank-head,.hml-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
      .hml-bank-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .hml-bank-row{border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:9px;display:grid;grid-template-columns:1.2fr .9fr .9fr .9fr auto;gap:10px;align-items:center}
      .hml-current{background:#f8fffc;border-color:#a9d9c8}
      .hml-badge{display:inline-block;padding:4px 8px;border-radius:999px;background:#e7f6ef;color:var(--green);font-size:12px;font-weight:700}
      @media(max-width:1000px){.hml-bank-row{grid-template-columns:1fr 1fr}.hml-bank-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(css);

    const fieldByLabel=(text)=>{
      const label=[...drawerBody.querySelectorAll('label')].find(x=>x.textContent.trim()===text);
      if(!label) return null;
      return (label.closest('.field')||label.parentElement)?.querySelector('select,input,textarea')||null;
    };
    const opts=(items,selected)=>'<option value="">—</option>'+items.map(x=>`<option value="${x.id}" ${x.id===selected?'selected':''}>${x.name}</option>`).join('');
    const today=()=>new Date().toISOString().slice(0,10);

    function migrateBanks(e){
      if(Array.isArray(e.bankAccounts)) return;
      e.bankAccounts=[];
      if(e.bankId||e.branchId||e.account||e.accountHolder){
        e.bankAccounts.push({id:'ba_'+Date.now(),bankId:e.bankId||'',branchId:e.branchId||'',account:e.account||'',holder:e.accountHolder||'',startDate:'',endDate:'',current:true});
      }
      save();
    }
    function currentBank(e){
      migrateBanks(e);
      return e.bankAccounts.find(x=>x.current)||e.bankAccounts.find(x=>!x.endDate)||e.bankAccounts[0]||null;
    }
    function syncLegacyBank(e,a){
      e.bankId=a?.bankId||'';e.branchId=a?.branchId||'';e.account=a?.account||'';e.accountHolder=a?.holder||'';
    }
    function bankOptions(selected){return opts(db.banks,selected)}
    function branchOptions(bankId,selected){return opts(db.branches.filter(x=>!bankId||x.bankId===bankId),selected)}

    function renderPayment(e){
      migrateBanks(e);
      const a=currentBank(e);
      const main=drawerBody.querySelector('.employee-detail-main')||drawerBody;
      const rows=e.bankAccounts.map((x,i)=>{
        const b=by(db.banks,x.bankId),br=by(db.branches,x.branchId);
        return `<div class="hml-bank-row ${x.current?'hml-current':''}">
          <div><b>${b?.name||'銀行未設定'}</b><div class="muted">${br?.name||'支店未設定'}</div></div>
          <div><b>口座番号</b><div class="muted">${x.account||'—'}</div></div>
          <div><b>口座名義</b><div class="muted">${x.holder||'—'}</div></div>
          <div><b>適用期間</b><div class="muted">${x.startDate||'—'} ～ ${x.current?'現在':(x.endDate||'—')}</div></div>
          <div>${x.current?'<span class="hml-badge">現在使用中</span>':`<button class="btn mini" onclick="hmlSetCurrentBank('${e.id}',${i})">現在の口座にする</button>`}</div>
        </div>`;
      }).join('');
      main.innerHTML=`<div class="hml-bank-card">
        <div class="hml-bank-head"><div><h3 style="margin:0">現在の振込口座</h3><div class="muted">現在有効な振込先</div></div>${a?'<span class="hml-badge">現在使用中</span>':''}</div>
        ${a?`<div class="hml-bank-grid">
          <div class="field"><label>銀行</label><select id="hml_bank">${bankOptions(a.bankId)}</select></div>
          <div class="field"><label>支店</label><select id="hml_branch">${branchOptions(a.bankId,a.branchId)}</select></div>
          <div class="field"><label>口座番号</label><input id="hml_account" value="${a.account||''}"></div>
          <div class="field"><label>口座名義</label><input id="hml_holder" value="${a.holder||''}"></div>
          <div class="field"><label>適用開始日</label><input type="date" id="hml_start" value="${a.startDate||''}"></div>
        </div>`:'<div class="muted">振込口座は登録されていません。</div>'}
      </div>
      <div class="hml-section-head"><h3 style="margin:0">口座履歴</h3><button class="btn primary" onclick="hmlAddBank('${e.id}')">+ 口座を追加</button></div>
      <div>${rows||'<div class="muted">口座履歴はありません。</div>'}</div>`;
      const bankSel=document.getElementById('hml_bank');
      if(bankSel) bankSel.onchange=()=>{document.getElementById('hml_branch').innerHTML=branchOptions(bankSel.value,'')};
      drawerFoot.innerHTML=`<button class="btn" onclick="closeDrawer()">閉じる</button>${a?`<button class="btn primary" onclick="hmlSaveBank('${e.id}')">保存</button>`:''}`;
    }

    window.hmlAddBank=(id)=>{
      const e=by(db.employees,id);migrateBanks(e);
      const prev=currentBank(e);if(prev){prev.current=false;if(!prev.endDate)prev.endDate=today()}
      const a={id:'ba_'+Date.now(),bankId:'',branchId:'',account:'',holder:'',startDate:today(),endDate:'',current:true};
      e.bankAccounts.push(a);syncLegacyBank(e,a);save();openEmployee(id,'pagamento');
    };
    window.hmlSetCurrentBank=(id,i)=>{
      const e=by(db.employees,id);migrateBanks(e);const a=e.bankAccounts[i];if(!a)return;
      e.bankAccounts.forEach((x,idx)=>{if(idx!==i&&x.current){x.current=false;if(!x.endDate)x.endDate=today()}});
      a.current=true;a.endDate='';if(!a.startDate)a.startDate=today();syncLegacyBank(e,a);save();openEmployee(id,'pagamento');
    };
    window.hmlSaveBank=(id)=>{
      const e=by(db.employees,id);const a=currentBank(e);if(!a)return;
      const bankId=document.getElementById('hml_bank')?.value||'',branchId=document.getElementById('hml_branch')?.value||'',account=document.getElementById('hml_account')?.value.trim()||'',holder=document.getElementById('hml_holder')?.value.trim()||'';
      if(!bankId||!branchId||!account||!holder){if(typeof systemNotice==='function')systemNotice('銀行・支店・口座番号・口座名義を入力してください。');return}
      Object.assign(a,{bankId,branchId,account,holder,startDate:document.getElementById('hml_start')?.value||a.startDate||today(),current:true,endDate:''});
      syncLegacyBank(e,a);const now=new Date().toISOString();e.history=e.history||[];e.history.push({date:now,text:'振込口座情報を更新'});e.updatedAt=now;e.updatedText='振込口座情報を更新';save();openEmployee(id,'pagamento');
    };

    function bindWork(e){
      const factory=fieldByLabel('工場'),sector=fieldByLabel('部署'),shift=fieldByLabel('班');
      if(!factory||!sector||!shift)return;
      const refresh=(fid,sectorId='',shiftId='')=>{
        const sectors=db.sectors.filter(x=>x.factoryId===fid),shifts=db.shifts.filter(x=>x.factoryId===fid);
        sector.innerHTML=opts(sectors,sectors.some(x=>x.id===sectorId)?sectorId:'');
        shift.innerHTML=opts(shifts,shifts.some(x=>x.id===shiftId)?shiftId:'');
      };
      refresh(factory.value,e.sectorId||'',e.shiftId||'');
      factory.onchange=()=>{refresh(factory.value,'','');sector.value='';shift.value=''};
    }

    const jaHistory=(s)=>{
      const t=String(s||'');
      const map=[['Aba moradia alterada','住居情報を更新'],['Aba trabalho alterada','勤務情報を更新'],['Aba dados alterada','基本情報を更新'],['Admissão cadastrada','入社情報を登録'],['Moradia alterada','住居情報を更新'],['Trabalho alterado','勤務情報を更新']];
      for(const [a,b] of map)if(t.includes(a))return b;
      return t;
    };
    function renderHistory(e){
      const main=drawerBody.querySelector('.employee-detail-main')||drawerBody;
      const seen=new Set(),rows=[];
      [...(e.history||[])].sort((a,b)=>new Date(b.date||0)-new Date(a.date||0)).forEach(x=>{
        const text=jaHistory(x.text),key=String(x.date||'').slice(0,10)+'|'+text;if(seen.has(key))return;seen.add(key);rows.push({...x,text});
      });
      main.innerHTML=`<div class="panel"><h3 style="margin-top:0">変更履歴</h3>${rows.length?rows.map(x=>`<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b>${String(x.date||'—').replace('T',' ').replace('Z','')}</b> — ${x.text}</div>`).join(''):'<div class="muted">変更履歴はありません。</div>'}</div>`;
      drawerFoot.innerHTML='<button class="btn" onclick="closeDrawer()">閉じる</button>';
    }

    const baseOpen=openEmployee;
    openEmployee=function(id,tab='dados'){
      baseOpen(id,tab);
      const e=by(db.employees,id);if(!e)return;
      setTimeout(()=>{
        if(tab==='pagamento')renderPayment(e);
        if(tab==='trabalho')bindWork(e);
        if(tab==='historico')renderHistory(e);
      },25);
    };
  };
  wait();
})();