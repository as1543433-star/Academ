/* app.js — الهيكل المشترك: يبني القائمة والهيدر والشريط السفلي ويشغّل الحركات */
(function(){
var B=document.body,role=B.dataset.role||'student',cur=B.dataset.page;
var SPRITE="<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\">\n  <symbol id=\"home\" viewBox=\"0 0 24 24\"><path d=\"M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z\"/></symbol>\n  <symbol id=\"book\" viewBox=\"0 0 24 24\"><path d=\"M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h12\"/></symbol>\n  <symbol id=\"cal\" viewBox=\"0 0 24 24\"><path d=\"M4 6h16v14H4zM4 10h16M8 3v4M16 3v4\"/></symbol>\n  <symbol id=\"task\" viewBox=\"0 0 24 24\"><path d=\"M9 4h6v3H9zM7 5H5v16h14V5h-2M9 14l2 2 4-4\"/></symbol>\n  <symbol id=\"grade\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"8\" r=\"6\"/><path d=\"M8.5 13L7 22l5-3 5 3-1.5-9\"/></symbol>\n  <symbol id=\"bell\" viewBox=\"0 0 24 24\"><path d=\"M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4\"/></symbol>\n  <symbol id=\"flask\" viewBox=\"0 0 24 24\"><path d=\"M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 15h9\"/></symbol>\n  <symbol id=\"heart\" viewBox=\"0 0 24 24\"><path d=\"M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z\"/></symbol>\n  <symbol id=\"pill\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"8\" width=\"18\" height=\"8\" rx=\"4\" transform=\"rotate(-35 12 12)\"/><path d=\"M9 9l6 6\"/></symbol>\n  <symbol id=\"micro\" viewBox=\"0 0 24 24\"><path d=\"M8 3l4 8M6 6l4 8M5 21h14M8 17a6 6 0 0 0 10-4\"/></symbol>\n</svg>";
var ROLES={
  student:{brand:'كلية الطب والصيدلة',sub:'بوابة الطالب',user:'نور الهدى سعيد',init:'ن',
    /* [مفتاح الصفحة، العنوان، الأيقونة، جاهزة؟] */
    nav:[['dashboard','الرئيسية','home',1],['courses','مقرراتي','book',1],['schedule','الجدول','cal',0],['assignments','التكليفات','task',0],['grades','الدرجات','grade',0]]}
};
var C=ROLES[role];
function ico(n){return '<svg class="i"><use href="#'+n+'"/></svg>'}
function link(n){return '<a href="'+(n[3]?n[0]+'.html':'#')+'"'+(n[3]?'':' data-soon')+(n[0]===cur?' class="on"':'')+'>'+ico(n[2])+n[1]+'</a>'}
var nav=C.nav.map(link).join('');

B.insertAdjacentHTML('afterbegin',SPRITE);
var pg=document.getElementById('page'),app=document.createElement('div');app.className='app';
app.innerHTML='<aside class="side"><div class="brand">'+C.brand+'<small>'+C.sub+'</small></div><nav>'+nav+'</nav></aside>'+
 '<main><header class="top"><div class="who"><div class="avatar">'+C.init+'</div><div><small style="color:var(--muted);display:block;line-height:1.2" id="hi"></small>'+C.user+'</div></div>'+
 '<button class="bell" aria-label="الإشعارات">'+ico('bell')+'<b></b></button></header><div class="wrap"></div></main>';
var wrap=app.querySelector('.wrap');
while(pg.firstChild)wrap.appendChild(pg.firstChild);
pg.replaceWith(app);
B.insertAdjacentHTML('beforeend','<nav class="dock" aria-label="التنقل"><span class="pill"></span>'+nav+'</nav><div class="toast" id="toast"></div>');

var h=new Date().getHours();
document.getElementById('hi').textContent=h<12?'صباح الخير':h<18?'مساء الخير':'مساء النور';

/* شريط سفلي: مؤشر منزلق */
var dock=B.querySelector('.dock'),pill=dock.querySelector('.pill');
function place(){var a=dock.querySelector('a.on');if(!a){pill.style.display='none';return}
  pill.style.width=a.offsetWidth+'px';pill.style.left=a.offsetLeft+'px';pill.style.right='auto'}
addEventListener('load',place);addEventListener('resize',place);place();

/* صفحات لم تُبنَ بعد */
var tt;
B.addEventListener('click',function(e){var a=e.target.closest('[data-soon]');if(!a)return;e.preventDefault();
  var t=document.getElementById('toast');t.textContent='هذه الصفحة قيد الإنشاء';t.classList.add('show');
  clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},1800)});

/* حركة التحميل: عدّادات + أشرطة */
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
requestAnimationFrame(function(){wrap.classList.add('go')});
wrap.querySelectorAll('[data-count]').forEach(function(el){
  var to=parseFloat(el.dataset.count),dec=+el.dataset.dec||0;
  if(reduce){el.textContent=to.toFixed(dec);return}
  var t0=null;(function f(t){t0=t0||t;var p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3);
    el.textContent=(to*e).toFixed(dec);if(p<1)requestAnimationFrame(f)})(performance.now());
});

/* تأثير الموجة على الأزرار */
B.addEventListener('click',function(e){var b=e.target.closest('.btn');if(!b)return;
  var r=b.getBoundingClientRect(),s=document.createElement('span');s.className='rip';
  s.style.cssText='width:40px;height:40px;left:'+(e.clientX-r.left-20)+'px;top:'+(e.clientY-r.top-20)+'px';
  b.appendChild(s);setTimeout(function(){s.remove()},650)});
})();
