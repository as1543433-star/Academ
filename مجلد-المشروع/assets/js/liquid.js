/* liquid.js — مؤشر الشريط السفلي: شكل بيضوي وحركة مائية بين الأقسام */
(function(){
var D=document,dock=D.querySelector('.dock'),pill=dock&&dock.querySelector('.pill');
if(!pill)return;
var st=D.createElement('style');
st.textContent='.dock{border-radius:40px}.dock .pill{border-radius:999px;transition:none!important;background:linear-gradient(160deg,var(--pine-2),var(--pine));box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 8px 20px rgba(0,0,0,.3);will-change:left,width,transform}.dock a{border-radius:999px}';
D.head.appendChild(st);
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,busy=false;
function box(a){return{l:a.offsetLeft,w:a.offsetWidth}}
function setBox(b){pill.style.width=b.w+'px';pill.style.left=b.l+'px';pill.style.right='auto'}
var SPRING='cubic-bezier(.34,1.45,.64,1)';

/* ظهور ناعم عند فتح الصفحة */
if(!reduce&&pill.animate)pill.animate([{transform:'scale(.82)',opacity:.4},{transform:'scale(1)',opacity:1}],{duration:520,easing:SPRING});

dock.addEventListener('click',function(e){
  var a=e.target.closest('a');
  if(!a||a.hasAttribute('data-more')||a.hasAttribute('data-soon')||a.classList.contains('on'))return;
  if(reduce||!pill.animate||busy)return;
  e.preventDefault();busy=true;
  var cur=dock.querySelector('a.on'),from=cur?box(cur):box(a),to=box(a);
  var l=Math.min(from.l,to.l),r=Math.max(from.l+from.w,to.l+to.w);
  var an=pill.animate([
    {left:from.l+'px',width:from.w+'px',transform:'scale(1,1)',offset:0},
    {left:l+'px',width:(r-l)+'px',transform:'scale(1,.8)',offset:.42,easing:SPRING},
    {left:to.l+'px',width:to.w+'px',transform:'scale(1,1)',offset:1}
  ],{duration:560,easing:'cubic-bezier(.5,0,.2,1)',fill:'forwards'});
  setTimeout(function(){dock.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)})},230);
  an.onfinish=function(){setBox(to);an.cancel()};
  setTimeout(function(){location.href=a.href},520);
  setTimeout(function(){busy=false},1200);
});
})();
