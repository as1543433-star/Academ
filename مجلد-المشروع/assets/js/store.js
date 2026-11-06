/* store.js — الحسابات والربط (تجريبي: داخل المتصفح) */
var AcadStore=(function(){
  var DB='acad_db',ME='acad_me',CH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function read(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
  function write(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function db(){var d=read(DB,null)||{};d.students=d.students||[];d.parents=d.parents||[];d.teachers=d.teachers||[];return d}
  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
  function makeCode(d){var c;do{c='';for(var i=0;i<6;i++)c+=CH.charAt(Math.floor(Math.random()*CH.length))}
    while(d.students.some(function(s){return s.code===c}));return c}
  function clean(c){return String(c||'').toUpperCase().replace(/\s+/g,'')}
  function findByCode(d,c){c=clean(c);for(var i=0;i<d.students.length;i++)if(d.students[i].code===c)return d.students[i];return null}
  return{
    me:function(){return read(ME,null)},
    setMe:function(role,id){write(ME,{role:role,id:id})},
    logout:function(){try{localStorage.removeItem(ME)}catch(e){}},
    resetAll:function(){try{localStorage.removeItem(ME);localStorage.removeItem(DB)}catch(e){}},
    addStudent:function(name){
      var d=db(),s={id:uid(),name:name,code:makeCode(d)};
      d.students.push(s);write(DB,d);this.setMe('student',s.id);return s},
    addTeacher:function(name){
      var d=db(),t={id:uid(),name:name};
      d.teachers.push(t);write(DB,d);this.setMe('teacher',t.id);return t},
    addParent:function(name,code){
      var d=db(),s=findByCode(d,code);
      if(!s)return{ok:false};
      var p={id:uid(),name:name,children:[s.id]};
      d.parents.push(p);write(DB,d);this.setMe('parent',p.id);return{ok:true,parent:p,student:s}},
    linkChild:function(parentId,code){
      var d=db(),s=findByCode(d,code);
      if(!s)return{ok:false};
      for(var i=0;i<d.parents.length;i++){
        if(d.parents[i].id===parentId){
          if(d.parents[i].children.indexOf(s.id)<0)d.parents[i].children.push(s.id);
          write(DB,d);return{ok:true,student:s}}}
      return{ok:false}},
    children:function(parentId){
      var d=db(),out=[];
      d.parents.forEach(function(p){if(p.id===parentId)p.children.forEach(function(id){
        d.students.forEach(function(s){if(s.id===id)out.push(s)})})});
      return out}
  }
})();
