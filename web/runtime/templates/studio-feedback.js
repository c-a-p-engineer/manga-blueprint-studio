// Prototype 0.9 hardening: localized select refresh and lightweight client-side feedback.
var toast=globalThis.toast||function(message){
  let el=document.getElementById('toast14');
  if(!el){el=document.createElement('div');el.id='toast14';el.setAttribute('role','status');el.style.cssText='position:fixed;left:50%;bottom:calc(78px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:120;background:#111827;color:#fff;padding:10px 14px;border-radius:999px;font-size:13px;box-shadow:0 8px 28px rgba(0,0,0,.24);max-width:calc(100vw - 32px);text-align:center;transition:opacity .2s';document.body.appendChild(el)}
  el.textContent=message;el.style.opacity='1';clearTimeout(el._timer14);el._timer14=setTimeout(()=>{el.style.opacity='0'},1800);
};
globalThis.toast=toast;

const applyLanguage13Base14=applyLanguage;
applyLanguage=function(){
  applyLanguage13Base14();
  syncTemplateSelect13();
  const close=document.querySelector('#customTemplateDialog13 button[value="close"]');if(close)close.textContent=t('panelPeekClose');
  renderTemplateGallery13();renderTemplatePreview13();
};
applyLanguage();
