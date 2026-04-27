// Completion fix: exercise only turns green when every set is checked complete AND every set has reps entered.
(function(){
  function repsEntered(s){return String(s&&s.reps||'').trim()!=='' && !isNaN(parseFloat(s.reps))}
  function setList(r){return r&&Array.isArray(r.sets)?r.sets:[]}
  function totalReps(r){return setList(r).reduce((a,s)=>a+(parseFloat(s.reps)||0),0)}
  function info(k,r){let sets=setList(r);if(!sets.length)return{complete:false,done:0,total:0,reps:0};let done=sets.filter((s,i)=>!!state.done[`${k}_${i}`]).length;let allReps=sets.every(repsEntered);return{complete:done===sets.length&&allReps,done,total:sets.length,reps:totalReps(r),allReps}}
  const oldRenderWorkout=renderWorkout;
  renderWorkout=function(){oldRenderWorkout();document.querySelectorAll('#workout .card').forEach(card=>{let badge=card.querySelector('.completeBadge,.incompleteBadge');if(!badge)return;let txt=badge.textContent||'';if(txt.includes('Complete')&&!txt.includes('total reps'))return;});}
  const oldToggleDone=window.toggleDone;
  window.toggleDone=function(k,idx){if(oldToggleDone)oldToggleDone(k,idx);setTimeout(()=>{try{renderWorkout()}catch(e){}},0)}
  const oldStableSetField=window.stableSetField;
  window.stableSetField=function(k,n,f,v){if(oldStableSetField)oldStableSetField(k,n,f,v);}
  // Patch the stability renderer by overriding the classes/badges after render.
  function patchCards(){document.querySelectorAll('#workout .card').forEach(card=>{let expandBtn=card.querySelector('button[onclick^="toggleCollapse"]');if(!expandBtn)return;let onclick=expandBtn.getAttribute('onclick')||'';let m=onclick.match(/toggleCollapse\('([^']+)'\)/);if(!m)return;let k=m[1],r=state.logs[k]||{},x=info(k,r);card.classList.toggle('exerciseComplete',x.complete);let oldComplete=card.querySelector('.completeBadge');let oldIncomplete=card.querySelector('.incompleteBadge');let badge=oldComplete||oldIncomplete;if(badge){badge.className=x.complete?'completeBadge':'incompleteBadge';badge.textContent=x.complete?`Complete • ${x.reps} total reps`:`${x.done}/${x.total} sets complete • ${x.reps} reps logged${x.total&&!x.allReps?' • reps needed':''}`;}})}
  const prevRender=renderWorkout;
  renderWorkout=function(){prevRender();patchCards()}
  setTimeout(patchCards,400);
})();