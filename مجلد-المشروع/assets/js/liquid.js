/* liquid.js — تنقل سريع بدون إعادة تحميل + مؤشر بيضوي بحركة مائية */
(function(){
var D=document,dock=D.querySelector('.dock'),pill=dock&&dock.querySelector('.pill'),SH=D.getElementById('sheet');
if(!pill)return;
var BASE=D.currentScript.src.replace(/liquid\.js.*$/,'');
var st=D.createElement('style');
st.textContent='.dock{border-radius:40px}.dock .pill{border-radius:999px;transition:none!important;background:linear-gradient(160deg,var(--pine-2),var(--pine));box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 8px 20px rgba(0,0,0,.3);will-change:left,width,transform}.dock a{border-radius:999px}.sws{display:grid;grid-template-columns:repeat(4,36px);gap:12px}.wrap{transition:opacity .16s ease,transform .16s ease}.wrap.out{opacity:0;transform:translateY(8px)}.ccs{display:flex;gap:8px;margin:2px 0 14px}.ccb{flex:1;padding:8px;border-radius:12px;border:1px solid var(--line);color:var(--ink);transition:.25s}.ccb.on{background:var(--pine);color:#fff;border-color:var(--pine)}';
D.head.appendChild(st);
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,busy=false,cache={},css={};
var SPRING='cubic-bezier(.34,1.45,.64,1)';
var ps=D.querySelector('script[src$="pages.js"]'),PAGES=ps?ps.src:BASE+'pages.js';
function wrapEl(){return D.querySelector('.wrap')}
function box(a){return{l:a.offsetLeft,w:a.offsetWidth}}
function setBox(b){pill.style.width=b.w+'px';pill.style.left=b.l+'px';pill.style.right='auto'}
function dirOf(u){return u.pathname.replace(/[^/]*$/,'')}
function file(u){return u.pathname.split('/').pop()}
function internal(a){var u=new URL(a.href,location.href);
  return u.origin===location.origin&&/\.html$/.test(u.pathname)&&dirOf(u)===dirOf(location)&&!a.hasAttribute('data-soon')&&!a.hasAttribute('data-more')&&a.getAttribute('href')!=='#'}

/* تحميل ملفات CSS الخاصة بالصفحة الجديدة قبل عرضها */
function ensureCSS(doc){var ps=[];
  doc.querySelectorAll('link[rel=stylesheet]').forEach(function(l){var h=l.href;
    if(!css[h]){var ex=[].some.call(D.querySelectorAll('link[rel=stylesheet]'),function(x){return x.href===h});
      css[h]=ex?Promise.resolve():new Promise(function(ok){var n=D.createElement('link');n.rel='stylesheet';n.href=h;n.onload=n.onerror=ok;D.head.appendChild(n)})}
    ps.push(css[h])});
  return Promise.all(ps)}
function fetchPage(url){if(cache[url])return cache[url];
  return cache[url]=fetch(url).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
    var d=new DOMParser().parseFromString(t,'text/html');if(!d.getElementById('page'))throw 0;ensureCSS(d);return d
  }).catch(function(e){delete cache[url];throw e})}

function counters(root){root.querySelectorAll('[data-count]').forEach(function(el){
  var to=parseFloat(el.dataset.count),dec=+el.dataset.dec||0;
  if(reduce){el.textContent=to.toFixed(dec);return}
  var t0=null;(function f(t){t0=t0||t;var p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3);
    el.textContent=(to*e).toFixed(dec);if(p<1)requestAnimationFrame(f)})(performance.now())})}

function setActive(f){
  D.querySelectorAll('.side nav a,.dock a:not([data-more]),.sheet a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')===f)});
  var more=dock.querySelector('[data-more]');if(more)more.classList.toggle('on',!!SH.querySelector('a.on'))}
function dockTarget(f){var m=null;dock.querySelectorAll('a').forEach(function(a){if(a.getAttribute('href')===f)m=a});return m||(SH.querySelector('a[href="'+f+'"]')?dock.querySelector('[data-more]'):null)}

function swap(d,u,push){
  var w=wrapEl();w.classList.remove('go');w.innerHTML=d.getElementById('page').innerHTML;
  D.body.dataset.page=d.body.dataset.page;setActive(d.body.dataset.page+'.html');
  if(window.__shell){__shell.title(d.title);__shell.walk()}else D.title=d.title;
  if(push)history.pushState(null,'',u.href);
  scrollTo(0,0);w.classList.remove('out');counters(w);if(window.__shell)__shell.place();
  var s=D.createElement('script');s.src=PAGES;s.onload=function(){s.remove()};D.body.appendChild(s);
  requestAnimationFrame(function(){w.classList.add('go')});
  busy=false}

function flow(from,to){
  var l=Math.min(from.l,to.l),r=Math.max(from.l+from.w,to.l+to.w);
  var an=pill.animate([
    {left:from.l+'px',width:from.w+'px',transform:'scale(1,1)',offset:0},
    {left:l+'px',width:(r-l)+'px',transform:'scale(1,.8)',offset:.42,easing:SPRING},
    {left:to.l+'px',width:to.w+'px',transform:'scale(1,1)',offset:1}
  ],{duration:560,easing:'cubic-bezier(.5,0,.2,1)',fill:'forwards'});
  an.onfinish=function(){setBox(to);an.cancel()}}

function navigate(a){
  var u=new URL(a.href,location.href);busy=true;
  wrapEl().classList.add('out');
  if(!reduce&&pill.animate&&getComputedStyle(dock).display!=='none'){
    var cur=dock.querySelector('a.on'),tgt=dockTarget(a.dataset.nav||file(u));
    if(cur&&tgt&&cur!==tgt)flow(box(cur),box(tgt))}
  var wait=new Promise(function(r){setTimeout(r,reduce?0:180)});
  Promise.all([fetchPage(u.href),wait]).then(function(x){return ensureCSS(x[0]).then(function(){swap(x[0],u,true)})})
    .catch(function(){location.href=u.href})}

D.addEventListener('click',function(e){
  var a=e.target.closest('.side a,.dock a,.sheet a,.wrap a');
  if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.button||!internal(a))return;
  e.preventDefault();SH.classList.remove('show');
  if(busy||new URL(a.href,location.href).pathname===location.pathname)return;
  navigate(a)});
addEventListener('popstate',function(){var u=new URL(location.href);
  fetchPage(u.href).then(function(d){swap(d,u,false);if(window.__shell)__shell.place()}).catch(function(){location.reload()})});

/* ظهور ناعم للمؤشر + تحميل مسبق لباقي الصفحات */
if(!reduce&&pill.animate)pill.animate([{transform:'scale(.82)',opacity:.4},{transform:'scale(1)',opacity:1}],{duration:520,easing:SPRING});
setTimeout(function(){D.querySelectorAll('.side nav a,.sheet a').forEach(function(a){
  if(internal(a))fetchPage(new URL(a.href,location.href).href).catch(function(){})})},700);
})();
