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
