// Log Workout subsection collapse controls + remove pain/discomfort blocks.
(function(){
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function ensure(){if(!state.sectionCollapsed)state.sectionCollapsed={};}
  window.toggleSectionCollapse=(id)=>{ensure();state.sectionCollapsed[id]=!state.sectionCollapsed[id];save();renderWorkout()}
  function cardTitle(card){let t=card.querySelector('.title');return t?t.textContent.trim():''}
  function removePainCards(root){[...root.querySelectorAll('.card')].forEach(c=>{let t=cardTitle(c).toLowerCase();if(t.includes('pain')||t.includes('discomfort'))c.remove()})}
  function makeCollapsible(card,id,meta){ensure();if(card.dataset.sectionDone)return;card.dataset.sectionDone='1';let title=cardTitle(card);if(!title)return;let collapsed=!!state.sectionCollapsed[id];let children=[...card.childNodes];card.innerHTML='';card.classList.toggle('sectionCollapsed',collapsed);let header=document.createElement('div');header.className='sectionHeader';header.innerHTML=`<div><div class="title">${E(title)}</div>${meta?`<div class="sectionMiniMeta">${E(meta)}</div>`:''}</div><button class="sectionCollapseBtn" onclick="toggleSectionCollapse('${id}')">${collapsed?'Expand':'Minimize'}</button>`;let body=document.createElement('div');body.className='collapseContent';children.forEach((node,idx)=>{if(idx===0&&node.nodeType===1&&node.classList&&node.classList.contains('title'))return;body.appendChild(node)});card.appendChild(header);card.appendChild(body)}
  function enhanceLogSections(){let root=document.getElementById('workout');if(!root)return;removePainCards(root);let cards=[...root.querySelectorAll('.card')];cards.forEach((card,idx)=>{let title=cardTitle(card);let lower=title.toLowerCase();if(card.querySelector('.completeBadge')||card.querySelector('.incompleteBadge'))return; if(lower.includes('today')||lower.includes('recovery')||lower.includes('warm-up calculator')||lower.includes('add manual exercise')||lower.includes('week 7 deload')){let id='section_'+lower.replace(/[^a-z0-9]+/g,'_');let meta='Tap to '+(state.sectionCollapsed&&state.sectionCollapsed[id]?'expand':'minimize');makeCollapsible(card,id,meta)}})}
  const prevWorkout=renderWorkout;
  renderWorkout=function(){prevWorkout();enhanceLogSections()}
  const prevExercise=renderExercise;
  renderExercise=function(e,i,k,isManual){let html=prevExercise(e,i,k,isManual);return html.replace(/<div class=card><div class=title>Pain[\s\S]*?Delete Manual Exercise<\/button><\/div>/,'')}
  setTimeout(()=>{try{renderWorkout()}catch(e){}},300)
})();