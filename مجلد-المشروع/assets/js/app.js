/* app.js — الهيكل المشترك + الوضع الليلي + اللغة + الأدوار */
(function(){
var D=document,H=D.documentElement,B=D.body,BASE=D.currentScript.src.replace(/js\/app\.js.*$/,'');
var Q=D.createElement('link');Q.rel='stylesheet';Q.href=BASE+'css/theme.css';D.head.appendChild(Q);
var Z=D.createElement('script');Z.src=BASE+'js/liquid.js';D.head.appendChild(Z);
function get(k,d){try{return localStorage.getItem(k)||d}catch(e){return d}}
function put(k,v){try{localStorage.setItem(k,v)}catch(e){}}
var theme=get('theme','light'),lang=get('lang','ar'),pal=+get('pal',0);

/* ---------- الأيقونات ---------- */
var IC={
home:'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
book:'M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 17a3 3 0 0 1 3-3h12',
cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
task:'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 14l2 2 4-4',
grade:'M12 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8.5 13L7 22l5-3 5 3-1.5-9',
bell:'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
flask:'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 15h9',
heart:'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
pill:'M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7zM8.5 8.5l7 7',
micro:'M8 3l4 8M6 6l4 8M5 21h14M8 17a6 6 0 0 0 10-4',
user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
users:'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6 6 0 0 1 3.5 6',
chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
card:'M3 6h18v12H3zM3 10h18M7 15h3',
chat:'M4 5h16v11H9l-5 4z',
exam:'M7 3h10v18H7zM10 8h4M10 12h4M10 16h2',
cert:'M4 4h16v12H4zM8 20h8M12 16v4M8 9h8',
check:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 12l3 3 5-6',
grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
moon:'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
sun:'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
palette:'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2H17a4 4 0 0 0 4-4c0-5-4-10-9-10zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01'};
var SPRITE='<svg width="0" height="0" style="position:absolute" aria-hidden="true">'+Object.keys(IC).map(function(k){return '<symbol id="'+k+'" viewBox="0 0 24 24"><path d="'+IC[k]+'"/></symbol>'}).join('')+'</svg>';
function ico(n){return '<svg class="i"><use href="#'+n+'"/></svg>'}

/* ---------- ألوان الموقع: [الاسم، أساسي، أساسي2، فاتح، لون النص في الليل] ---------- */
var PAL=[['زمردي','#0B4A4F','#126067','#8DB3A6','#7FD1C3'],['أزرق ملكي','#1E3A8A','#2B50B8','#9DB4E0','#9DB8FF'],['بنفسجي','#4C2A85','#6A3FB5','#B7A2E0','#C4A9FF'],['توتي','#7A1F3D','#A02C55','#E0A3B5','#F2A0BC'],['فحمي','#2F3E46','#52616B','#A7B5BD','#B9C7CF'],['زيتوني','#3B5323','#5A7A35','#B5C99A','#C8E39A'],['سماوي','#0E5A78','#1580A6','#8FCBE0','#7FD6F5'],['نحاسي','#8A4B2D','#B0653F','#E3BBA3','#F2B999']];

/* ---------- الأدوار والقوائم: [المفتاح، العنوان، الأيقونة، جاهزة؟، في الشريط السفلي؟] ---------- */
var ROLES={
student:{sub:'بوابة الطالب',user:'نور الهدى سعيد',init:'ن',nav:[
['dashboard','الرئيسية','home',1,1],['courses','مقرراتي','book',1,1],['schedule','الجدول','cal',1,1],['assignments','التكليفات','task',1,1],
['grades','الدرجات','grade',1,0],['attendance','الحضور','check',0,0],['exams','الاختبارات','exam',0,0],['certificates','الشهادات','cert',0,0],['messages','الرسائل','chat',0,0],['profile','الملف الشخصي','user',0,0]]},
parent:{sub:'بوابة ولي الأمر',user:'أ. سعيد محمود',init:'س',nav:[
['dashboard','الرئيسية','home',1,1],['children','أبنائي','users',0,1],['reports','التقارير','chart',0,1],['payments','المدفوعات','card',0,1],['messages','الرسائل','chat',0,0],['profile','الملف الشخصي','user',0,0]]}};
var ROLE_LIST=[['student','طالب',1],['parent','ولي أمر',1],['teacher','معلم',0],['admin','مدير',0]];
var role=B.dataset.role||'student',cur=B.dataset.page,C=ROLES[role];

/* ---------- الترجمة إنجليزي ---------- */
var EN={'كلية الطب والصيدلة':'College of Medicine & Pharmacy','بوابة الطالب':'Student Portal','بوابة ولي الأمر':'Parent Portal','صباح الخير':'Good morning','مساء الخير':'Good evening','مساء النور':'Good evening',
'هذه الصفحة قيد الإنشاء':'This page is under construction','المزيد':'More','اختر لون الموقع':'Choose site color','تبديل الحساب':'Switch account','قريباً':'Soon',
'نور الهدى سعيد':'Nour El-Hoda Saeed','أ. سعيد محمود':'Mr. Saeed Mahmoud','طالب':'Student','ولي أمر':'Parent','معلم':'Teacher','مدير':'Admin',
'زمردي':'Emerald','أزرق ملكي':'Royal blue','بنفسجي':'Violet','توتي':'Berry','فحمي':'Charcoal',
'الرئيسية':'Home','مقرراتي':'My courses','الجدول':'Schedule','التكليفات':'Assignments','الدرجات':'Grades','الحضور':'Attendance','الاختبارات':'Exams','الشهادات':'Certificates','الرسائل':'Messages','الملف الشخصي':'Profile','أبنائي':'My children','التقارير':'Reports','المدفوعات':'Payments',
'أهلاً بعودتك يا نور':'Welcome back, Nour','السنة الثالثة — كلية الصيدلة، الفصل الدراسي الأول':'Year 3, Pharmacy, first semester','علم الأدوية العملي':'Practical pharmacology','معمل 4، مبنى العلوم الصحية':'Lab 4, Health Sciences Building','تفاصيل الحصة':'Session details','التقدم في الفصل الدراسي':'Semester progress',
'المعدل التراكمي':'Cumulative GPA','نسبة الحضور':'Attendance rate','أعلى من متوسط الدفعة':'Above class average','الساعات المعتمدة':'Credit hours','تكليفات مفتوحة':'Open assignments','واحد يسلم غداً':'One due tomorrow',
'جدول اليوم':'Today\'s schedule','الكيمياء الصيدلانية 2':'Pharmaceutical Chemistry 2','محاضرة':'Lecture','معمل':'Lab','سكشن':'Section','علم الأحياء الدقيقة':'Microbiology','الصيدلة الإكلينيكية':'Clinical pharmacy','قاعة المحاضرات الكبرى':'Main lecture hall',
'علم الأدوية':'Pharmacology','الكيمياء الصيدلانية':'Pharmaceutical chemistry','الأحياء الدقيقة':'Microbiology','الصيدلانيات':'Pharmaceutics','د. هالة الشريف':'Dr. Hala El-Sherif','د. كريم عبد الله':'Dr. Karim Abdallah','د. منى الحسيني':'Dr. Mona El-Husseini','د. طارق منصور':'Dr. Tarek Mansour','د. سمير فؤاد':'Dr. Samir Fouad',
'المواعيد القادمة':'Upcoming deadlines','نوفمبر':'Nov','أكتوبر':'Oct','تقرير تجربة معملية':'Lab experiment report','غداً':'Tomorrow','اختبار قصير: الأحماض الأمينية':'Quiz: amino acids','جاهز للمراجعة':'Ready to review','حالة دراسية: مضادات حيوية':'Case study: antibiotics','لم تبدأ':'Not started',
'ساعات المذاكرة هذا الأسبوع':'Study hours this week','سبت':'Sat','أحد':'Sun','اثنين':'Mon','ثلاثاء':'Tue','أربعاء':'Wed','خميس':'Thu','جمعة':'Fri','أكثر أيامك تركيزاً: الأربعاء، 5 ساعات و20 دقيقة.':'Your most focused day: Wednesday, 5h 20m.',
'مقرراتي':'My courses','الجدول الدراسي':'Class schedule','التشريح الوصفي':'Descriptive anatomy','مراجعة عامة':'General review','4 مفتوحة، وواحد متأخر':'4 open, 1 late','الكل':'All','مفتوحة':'Open','متأخرة':'Late','مسلّمة':'Submitted',
'عرض تقديمي: النمو البكتيري':'Presentation: bacterial growth','تقرير مزرعة بكتيرية':'Bacterial culture report','ملخص الفصل الرابع':'Chapter 4 summary','واجب حسابات الجرعات':'Dose calculation assignment','متأخر يومين':'2 days late','لا توجد تكليفات في هذا القسم.':'No assignments in this section.',
'الدرجات المرصودة حتى الآن في الفصل الأول':'Grades recorded so far this semester','معدل الفصل':'Semester GPA','أعلى من المعدل التراكمي':'Above cumulative GPA','أعلى درجة':'Highest score','مقررات الفصل':'Semester courses','كلها بتقدير B أو أعلى':'All at grade B or above','المقررات':'Courses',
'متابعة الأبناء':'Following your children','ملخص أداء أبنائك في الفصل الدراسي الأول':'Your children\'s performance this semester','نور الهدى':'Nour El-Hoda','يوسف':'Youssef','صيدلة، السنة الثالثة':'Pharmacy, Year 3','طب، السنة الأولى':'Medicine, Year 1',
'الحضور هذا الشهر':'Attendance this month','تكليفات متأخرة':'Late assignments','الرسوم المدفوعة':'Fees paid','يحتاج متابعة':'Needs follow-up','لا يوجد':'None','مسددة بالكامل':'Paid in full','ممتاز':'Excellent','آخر الدرجات':'Latest grades','تنبيهات وملاحظات':'Alerts and notes','تنبيه':'Alert',
'التشريح الوصفي ':'Descriptive anatomy','الفسيولوجيا':'Physiology','الكيمياء الحيوية':'Biochemistry','غياب عن محاضرة الكيمياء الصيدلانية':'Absent from a pharmaceutical chemistry lecture','تكليف علم الأدوية يسلم غداً':'Pharmacology assignment due tomorrow','حصلت على 19 من 20 في واجب الجرعات':'Scored 19/20 on the dose assignment',
'اختبار التشريح الأسبوع القادم':'Anatomy exam next week','حضور ممتاز هذا الشهر':'Excellent attendance this month','لا تنبيهات أخرى':'No other alerts'};
var PAT=[[/^(قاعة|معمل) (\d+)$/,function(a,n){return(a==='قاعة'?'Hall ':'Lab ')+n}],[/^الأسبوع (\d+) من (\d+)$/,function(a,b){return 'Week '+a+' of '+b}],
[/^بعد (\d+) (?:أيام|يوماً)$/,function(a){return 'In '+a+' days'}],[/^الاختبارات النصفية بعد (\d+) أيام$/,function(a){return 'Midterms in '+a+' days'}],
[/^من (\d+(?:\.\d+)?)( ساعة)?$/,function(a,h){return 'of '+a+(h?' hours':'')}],[/^\S+: (\d+) من (\d+)$/,function(a,b){return 'Submitted: '+a+'/'+b}],
[/^أعمال السنة (\d+) من (\d+)، نصفي (\d+) من (\d+)$/,function(a,b,c,d){return 'Coursework '+a+'/'+b+', midterm '+c+'/'+d}],
[/^(\d+) مقررات في الفصل الدراسي الأول$/,function(a){return a+' courses in the first semester'}],[/^الدفعة القادمة (\d+) ديسمبر$/,function(a){return 'Next installment: Dec '+a}],
[/^أهلاً بك يا (.+)$/,function(a){return 'Welcome, '+(EN[a]||a)}]];
function norm(s){return s.replace(/[\u064B-\u0652]/g,'')}
var ENN={};Object.keys(EN).forEach(function(k){ENN[norm(k).trim()]=EN[k]});
function tr(s){var m=s.match(/^(\s*)([\s\S]*?)(\s*)$/),k=norm(m[2]),r=ENN[k];
  if(r===undefined)for(var i=0;i<PAT.length;i++){var x=k.match(PAT[i][0]);if(x){r=PAT[i][1].apply(null,x.slice(1));break}}
  return r===undefined?s:m[1]+r+m[3]}
var T0=D.title;
function walk(){var w=D.createTreeWalker(B,NodeFilter.SHOW_TEXT),n,en=lang==='en';
  while(n=w.nextNode()){var p=n.parentNode.nodeName;if(p==='SCRIPT'||p==='STYLE')continue;
    if(n.__a===undefined)n.__a=/[\u0600-\u06FF]/.test(n.nodeValue)?n.nodeValue:null;
    if(n.__a===null)continue;var v=en?tr(n.__a):n.__a;if(n.nodeValue!==v)n.nodeValue=v}
  D.title=en?T0.split(' — ').map(tr).join(' — '):T0}

/* ---------- بناء الهيكل ---------- */
function link(n){return '<a href="'+(n[3]?n[0]+'.html':'#')+'"'+(n[3]?'':' data-soon')+(n[0]===cur?' class="on"':'')+'>'+ico(n[2])+n[1]+'</a>'}
var nav=C.nav.map(link).join(''),dockN=C.nav.filter(function(n){return n[4]}),rest=C.nav.filter(function(n){return !n[4]});
var inRest=rest.some(function(n){return n[0]===cur});
B.insertAdjacentHTML('afterbegin',SPRITE);
var pg=D.getElementById('page'),app=D.createElement('div');app.className='app';
app.innerHTML='<aside class="side"><div class="brand">كلية الطب والصيدلة<small>'+C.sub+'</small></div><nav>'+nav+'</nav></aside>'+
'<main><header class="top"><button class="who" id="who"><div class="avatar">'+C.init+'</div><div><small style="color:var(--muted);display:block;line-height:1.2" id="hi"></small>'+C.user+'</div></button>'+
'<div class="tools"><button class="bell" id="bl" aria-label="Language"></button><button class="bell" id="bt" aria-label="Theme"></button><button class="bell" id="bp" aria-label="Colors">'+ico('palette')+'</button>'+
'<button class="bell" aria-label="Notifications">'+ico('bell')+'<b></b></button></div></header><div class="wrap"></div></main>';
var wrap=app.querySelector('.wrap');
while(pg.firstChild)wrap.appendChild(pg.firstChild);
pg.replaceWith(app);
B.insertAdjacentHTML('beforeend','<nav class="dock" aria-label="Navigation"><span class="pill"></span>'+dockN.map(link).join('')+
'<a href="#" data-more'+(inRest?' class="on"':'')+'>'+ico('grid')+'المزيد</a></nav><div class="sheet" id="sheet">'+rest.map(link).join('')+'</div><div class="pop" id="pop"></div><div class="toast" id="toast"></div>');
var h=new Date().getHours();
D.getElementById('hi').textContent=h<12?'صباح الخير':h<18?'مساء الخير':'مساء النور';

/* ---------- الحالة: ثيم + لغة + لون ---------- */
var dock=B.querySelector('.dock'),pill=dock.querySelector('.pill'),POP=D.getElementById('pop'),SH=D.getElementById('sheet');
function place(){var a=dock.querySelector('a.on');if(!a){pill.style.display='none';return}
  pill.style.display='';pill.style.width=a.offsetWidth+'px';pill.style.left=a.offsetLeft+'px';pill.style.right='auto'}
function applyPal(){var p=PAL[pal]||PAL[0],s=H.style;s.setProperty('--pine',p[1]);s.setProperty('--pine-2',p[2]);s.setProperty('--sage',p[3]);s.setProperty('--lt',p[4])}
function refresh(){
  H.dataset.theme=theme;H.lang=lang;H.dir=lang==='ar'?'rtl':'ltr';applyPal();
  D.getElementById('bl').textContent=lang==='ar'?'EN':'ع';
  D.getElementById('bt').innerHTML=ico(theme==='dark'?'sun':'moon');
  D.getElementById('bp').hidden=theme!=='dark';
  var m=D.querySelector('meta[name=theme-color]');if(m)m.content=theme==='dark'?'#0B1416':'#0B4A4F';
  walk();place()}
function popOpen(html,cls){POP.className='pop show '+(cls||'');POP.innerHTML=html;walk()}
function palPop(){popOpen('<b>اختر لون الموقع</b><div class="sws">'+PAL.map(function(p,i){return '<button class="sw'+(i===pal?' on':'')+'" data-i="'+i+'" style="--c:'+p[1]+';--d:'+p[4]+'" aria-label="'+p[0]+'"></button>'}).join('')+'</div>')}
function rolePop(){popOpen('<b>تبديل الحساب</b>'+ROLE_LIST.map(function(r){return r[2]?'<a href="../'+r[0]+'/dashboard.html"'+(r[0]===role?' class="on"':'')+'>'+r[1]+'</a>':'<a href="#" data-soon>'+r[1]+' <small>قريباً</small></a>'}).join(''),'s')}
var tt;function toast(){var t=D.getElementById('toast');t.textContent='هذه الصفحة قيد الإنشاء';walk();t.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('show')},1800)}

B.addEventListener('click',function(e){var t=e.target;
  if(t.closest('#bl')){lang=lang==='ar'?'en':'ar';put('lang',lang);refresh();return}
  if(t.closest('#bt')){theme=theme==='dark'?'light':'dark';put('theme',theme);refresh();if(theme==='dark')palPop();else POP.classList.remove('show');return}
  if(t.closest('#bp')){palPop();return}
  if(t.closest('#who')){rolePop();return}
  var sw=t.closest('.sw');if(sw){pal=+sw.dataset.i;put('pal',pal);applyPal();palPop();return}
  var mo=t.closest('[data-more]');if(mo){e.preventDefault();SH.classList.toggle('show');return}
  var so=t.closest('[data-soon]');if(so){e.preventDefault();toast();return}
  var b=t.closest('.btn');if(b){var r=b.getBoundingClientRect(),s=D.createElement('span');s.className='rip';
    s.style.cssText='width:40px;height:40px;left:'+(e.clientX-r.left-20)+'px;top:'+(e.clientY-r.top-20)+'px';b.appendChild(s);setTimeout(function(){s.remove()},650)}
  if(!t.closest('.pop'))POP.classList.remove('show');if(!t.closest('.sheet'))SH.classList.remove('show')});
addEventListener('load',place);addEventListener('resize',place);

/* ---------- حركة التحميل ---------- */
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
requestAnimationFrame(function(){wrap.classList.add('go')});
wrap.querySelectorAll('[data-count]').forEach(function(el){
  var to=parseFloat(el.dataset.count),dec=+el.dataset.dec||0;
  if(reduce){el.textContent=to.toFixed(dec);return}
  var t0=null;(function f(t){t0=t0||t;var p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3);
    el.textContent=(to*e).toFixed(dec);if(p<1)requestAnimationFrame(f)})(performance.now())});
window.__shell={walk:walk,place:place,title:function(t){T0=t}};
refresh();
})();
