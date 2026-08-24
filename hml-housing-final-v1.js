(()=>{
 const wait=()=>{if(typeof openEmployee!=='function'||typeof db==='undefined'||typeof by!=='function'||typeof save!=='function')return setTimeout(wait,60);if(window.__hmlHousingFinalV1)return;window.__hmlHousingFinalV1=1;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=n=>n==null||n===''?'—':'¥'+Number(n||0).toLocaleString('ja-JP');
 const residents=d=>db.employees.filter(x=>x.dormId===d.id).length;
 const employeeCost=d=>{if(!d)return '';if(Number(d.capacity||1)>1&&Number(d.perPerson||0)>0)return Number(d.perPerson);return Number(d.rent||0)+Number(d.fee||0)};
 const equipment=d=>{const a=d?.appliances||[];return a.length?a.map(x=>x.type+(x.control?`（${x.control}）`:'')).join('・'):'なし'};
 const parking=d=>{if(!d)return '';const raw=d.parking??d.hasParking??d.parkingAvailable;if(raw===true||raw==='yes'||raw==='あり'||raw===1)return 'あり';if(raw===false||raw==='no'||raw==='なし'||raw===0)return 'なし';return '未登録'};
 const dormOpts=(sel,home)=>'<option value="">—</option>'+db.dorms.map(d=>`<option value="${d.id}" ${d.id===sel?'selected':''}>${esc(d.name)}</option>`).join('')+`<option value="__home__" ${home?'selected':''}>自宅</option>`;
 function isHome(e){return e.housingType==='home'||(!e.dormId&&!!e.address)}
 function render(e,edit=false){
  const main=drawerBody.querySelector('.employee-detail-main')||drawerBody,d=e.dormId?by(db.dorms,e.dormId):null,home=isHome(e),count=d?residents(d):0,cap=Number(d?.capacity||0);
  main.innerHTML=`<div id="housingAlert" style="display:none;margin:0 0 14px;padding:11px 13px;border-radius:10px;background:#eef6ff;border:1px solid #b9d5f5;color:#175a9c;font-weight:700"></div><div class="hml-bank-card"><div class="hml-bank-head"><div><h3 style="margin:0">現在の住居</h3><div class="muted">社員の現在の住居情報</div></div><button class="btn ${edit?'primary':''}" id="housingEditBtn">${edit?'保存':'編集'}</button></div><div class="hml-bank-grid">
  <div class="field"><label>住居情報 *</label><select id="housingDorm" ${edit?'':'disabled'}>${dormOpts(e.dormId||'',home)}</select></div>
  <div class="field"><label>住所 *</label><input id="housingAddress" value="${esc(d?.address||e.address||'')}" ${edit&&home?'':'readonly'}></div>
  <div class="field"><label>本人負担額</label><input value="${d?money(employeeCost(d)):''}" readonly></div>
  <div class="field"><label>駐車場</label><input value="${d?parking(d):''}" readonly></div>
  <div class="field"><label>備品</label><input value="${d?esc(equipment(d)):''}" readonly></div>
  <div class="field"><label>入居状況</label><input value="${d?(count+' / '+cap+'人'):''}" readonly></div>
 </div></div>`;
  drawerFoot.innerHTML='<button class="btn" onclick="closeDrawer()">閉じる</button>';
  const btn=document.getElementById('housingEditBtn');btn.onclick=()=>edit?commit(e):render(e,true);
  const sel=document.getElementById('housingDorm');if(edit)sel.onchange=()=>{const val=sel.value,addr=document.getElementById('housingAddress');if(val==='__home__'){addr.value=e.housingType==='home'?e.address||'':'';addr.readOnly=false;addr.focus()}else{const nd=by(db.dorms,val);addr.value=nd?.address||'';addr.readOnly=true}renderPreview(val,e)};
 }
 function renderPreview(val,e){const d=val&&val!=='__home__'?by(db.dorms,val):null;const inputs=[...drawerBody.querySelectorAll('.hml-bank-grid .field input')];if(inputs.length<5)return;if(d){inputs[1].value=money(employeeCost(d));inputs[2].value=parking(d);inputs[3].value=equipment(d);inputs[4].value=`${residents(d)} / ${Number(d.capacity||0)}人`}else{inputs[1].value='';inputs[2].value='';inputs[3].value='';inputs[4].value=''}}
 function commit(e){const sel=document.getElementById('housingDorm'),addr=document.getElementById('housingAddress'),val=sel.value;if(!val){showErr('住居情報を選択してください。',sel);return}if(val==='__home__'&&!addr.value.trim()){showErr('自宅の住所を入力してください。',addr);return}const oldDorm=e.dormId||'',oldAddr=e.address||'';if(val==='__home__'){e.dormId='';e.housingType='home';e.address=addr.value.trim()}else{const d=by(db.dorms,val);e.dormId=val;e.housingType='dorm';e.address=d?.address||''}if(oldDorm!==e.dormId||oldAddr!==e.address){const now=new Date().toISOString();e.history=e.history||[];e.history.push({date:now,text:'住居情報を更新'});e.updatedAt=now;e.updatedText='住居情報を更新'}save();render(e,false);if(typeof showSavedStatus==='function')showSavedStatus()}
 function showErr(msg,el){const a=document.getElementById('housingAlert');if(a){a.textContent=msg;a.style.display='block';a.style.background='#fff4f4';a.style.borderColor='#e6aaaa';a.style.color='#a22'}if(el)el.style.borderColor='#d94848'}
 const base=openEmployee;openEmployee=function(id,tab='dados'){base(id,tab);if(tab==='moradia'){const e=by(db.employees,id);setTimeout(()=>render(e,false),130)}};
 };wait();
})();