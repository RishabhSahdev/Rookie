// Collapsible exercise cards + green completion summaries.
(function(){
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function ensureCollapse(){if(!state.collapsed)state.collapsed={};if(!state.done)state.done={};}
  function setList(r){return r&&r.sets?r.sets:[]}
  function totalReps(r){return setList(r).reduce((a,s)=>a+(parseFloat(s.reps)||0),0)}
  function completeInfo(k,r){let sets=setList(r);if(!sets.length)return{complete:false,done:0,total:0,reps:0};let done=sets.filter((s,i)=>!!state.done[`${k}_${i}`]).length;return{complete:done===sets.length,done,total:sets.length,reps:totalReps(r)}}
  window.toggleCollapse=(k)=>{ensureCollapse();state.collapsed[k]=!state.collapsed[k];save();renderWorkout()}
  const previousRenderExercise=renderExercise;
  renderExercise=function(e,i,k,isManual){ensureCollapse();let r=state.logs[k]||{};let info=completeInfo(k,r);let isCollapsed=!!state.collapsed[k];let selected=isManual?e:(typeof cur==='function'?cur(e,k):e);let title=selected&&selected.name?selected.name:e.name;let badge=info.complete?`<span class=completeBadge>Complete • ${info.reps} total reps</span>`:`<span class=incompleteBadge>${info.done}/${info.total||0} sets complete • ${info.reps} reps logged</span>`;
    if(isCollapsed){return `<div class="card exerciseMini"><div class=collapseHead><div><div class=title>${E(title)}</div>${badge}<div class=miniMeta>${E(e.sets||1)} working • ${E(e.reps||'')} reps • ${E(e.rest||'')}</div></div><button class=collapseBtn onclick="toggleCollapse('${k}')">Expand</button></div></div>`}
    let html=previousRenderExercise(e,i,k,isManual);
    html=html.replace('<div class=card>','<div class="card '+(info.complete?'exerciseComplete':'')+'">');
    html=html.replace(`<div class=title>${title}</div>`,`<div class=collapseHead><div><div class=title>${E(title)}</div>${badge}</div><button class=collapseBtn onclick="toggleCollapse('${k}')">Minimize</button></div>`);
    return html;
  }
  const previousToggleDone=window.toggleDone;
  if(previousToggleDone){window.toggleDone=function(k,idx){previousToggleDone(k,idx);}}
  setTimeout(()=>{try{renderWorkout()}catch(e){}},400)
})();