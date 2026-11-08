/* pages.js — تبويبات وفلاتر: <div data-tabs="#هدف"> مع أزرار data-t، والعناصر data-k */
document.querySelectorAll('[data-tabs]').forEach(function(g){
  var btns=g.querySelectorAll('[data-t]'),sel=g.dataset.tabs;
  btns.forEach(function(b){b.addEventListener('click',function(){
    btns.forEach(function(x){x.classList.toggle('on',x===b)});
    var k=b.dataset.t,n=0;
    document.querySelectorAll(sel+' [data-k]').forEach(function(el){
      var show=k==='all'||el.dataset.k.split(' ').indexOf(k)>-1;
      el.hidden=!show;
      if(show){n++;el.classList.remove('fx');void el.offsetWidth;el.classList.add('fx')}
    });
    var e=document.querySelector(sel+' .empty');if(e)e.hidden=n>0;
  })});
});
/* ---------- بيانات المستخدم الحقيقية (بتشتغل مع كل تنقل) ---------- */
window.copyIt=function(){
  var c=document.getElementById('pf-code'),b=document.getElementById('pf-copy');
  if(!c)return;
  if(navigator.clipboard){navigator.clipboard.writeText(c.textContent)}
  if(b)b.textContent='تم النسخ ✓';
};
window.logout=function(){
  try{localStorage.removeItem('acad_me')}catch(e){}
  location.href='../../welcome.html';
};
(function(){
  var $=function(i){return document.getElementById(i)};
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var m=null,d=null,me=null;
  try{m=JSON.parse(localStorage.getItem('acad_me'));d=JSON.parse(localStorage.getItem('acad_db'))}catch(e){}
  if(m&&d&&m.role==='student'&&d.students){d.students.forEach(function(s){if(s.id===m.id)me=s})}

  /* الترحيب في الرئيسية */
  if($('hello')&&me){$('hello').textContent='أهلاً بك يا '+me.name.trim().split(/\s+/)[0]}

  /* الملف الشخصي */
  if($('pf-name')){
    if(!me){
      if($('nodata'))$('nodata').hidden=false;
    }else{
      $('pf-name').textContent=me.name;
      $('pf-name2').textContent=me.name;
      $('pf-init').textContent=me.name.trim().charAt(0);
      $('pf-code').textContent=me.code;
      var ps=(d.parents||[]).filter(function(p){return p.children.indexOf(me.id)>-1});
      $('pf-parents').innerHTML=ps.length
        ?ps.map(function(p){return '<div class="kv"><b>'+esc(p.name)+'</b><span>مرتبط ✓</span></div>'}).join('')
        :'<div class="kv"><span>لم يرتبط أي ولي أمر بعد</span></div>';
    }
  }
  if(window.__shell)__shell.walk();
})();
