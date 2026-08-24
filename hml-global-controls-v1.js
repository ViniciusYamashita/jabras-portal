(()=>{
 if(window.__hmlGlobalControlsV1)return;window.__hmlGlobalControlsV1=1;
 const css=document.createElement('style');css.textContent=`
 :root{--hml-control-border:#cfdced;--hml-control-focus:#2876dd;--hml-control-bg:#fff;--hml-control-radius:10px}
 select,input[type=date],input[type=datetime-local],input[type=month]{border-radius:var(--hml-control-radius)!important;border:1px solid var(--hml-control-border)!important;background-color:var(--hml-control-bg)!important;transition:border-color .15s ease,box-shadow .15s ease!important}
 select:focus,input[type=date]:focus,input[type=datetime-local]:focus,input[type=month]:focus{outline:none!important;border-color:var(--hml-control-focus)!important;box-shadow:0 0 0 3px rgba(40,118,221,.12)!important}
 select:not([multiple]){cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,#64748b 50%),linear-gradient(135deg,#64748b 50%,transparent 50%)!important;background-position:calc(100% - 18px) 50%,calc(100% - 13px) 50%!important;background-size:5px 5px,5px 5px!important;background-repeat:no-repeat!important;padding-right:36px!important;appearance:none!important;-webkit-appearance:none!important}
 input[type=date],input[type=datetime-local],input[type=month]{cursor:pointer}
 input[type=date]::-webkit-calendar-picker-indicator,input[type=datetime-local]::-webkit-calendar-picker-indicator,input[type=month]::-webkit-calendar-picker-indicator{cursor:pointer;padding:6px;border-radius:7px;opacity:.7;transition:background .15s ease,opacity .15s ease}
 input[type=date]::-webkit-calendar-picker-indicator:hover,input[type=datetime-local]::-webkit-calendar-picker-indicator:hover,input[type=month]::-webkit-calendar-picker-indicator:hover{background:#edf5ff;opacity:1}
 .hml-combo-menu,.hml-select-menu{border-radius:12px!important;border:1px solid #d6e1ef!important;box-shadow:0 10px 28px rgba(15,42,74,.14)!important;overflow:hidden!important;background:#fff!important;padding:5px!important}
 .hml-combo-option,.hml-select-option{border-radius:8px!important;padding:9px 11px!important}
 `;document.head.appendChild(css);
})();