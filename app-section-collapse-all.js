// Collapsible sections for Plan Links and Stats tabs + remove Recovery Check-In.
(function(){
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function ensure(){if(!state.sectionCollapsed)state.sectionCollapsed={};}
  function titleOf(card){return (card.querySelector('.title')?.textContent||'').trim()}
  function shouldRemove(card){let t=titleOf(card).toLowerCase();return t.includes('recovery check-in')||t==='recovery'}
  function isAlready(card){return card.dataset.collapsibleDone==='1'}
  window.toggleAnySection=(id)=>{ensure();state.sectionCollapsed[id]=!state.sectionCollapsed[id];save();rerenderCurrent()}
  function rerenderCurrent(){
    if(!$('workout')?.classList.contains('hidden'))renderWorkout();
    else if(!$('plan')?.classList.contains('hidden'))renderPlan();
    else if(!$('analytics')?.classList.contains('hidden'))renderAnalytics();
    else if(!$('settings')?.classList.contains('hidden'))renderSettings();
  }
  function wrapCard(card,id,meta){
    ensure(); if(isAlready(card))return; card.dataset.collapsibleDone='1';
    let title=titleOf(card); if(!title)return;
    let collapsed=!!state.sectionCollapsed[id];
    let nodes=[...card.childNodes]; card.innerHTML=''; card.classList.toggle('sectionCollapsed',collapsed);
    let head=document.createElement('div'); head.className='sectionHeader';
    head.innerHTML=`<div><div class="title">${E(title)}</div>${meta?`<div class="sectionMiniMeta">${E(meta)}</div>`:''}</div><button class="sectionCollapseBtn" onclick="toggleAnySection('${id}')">${collapsed?'Expand':'Minimize'}</button>`;
    let body=document.createElement('div'); body.className='collapseContent';
    nodes.forEach((node,idx)=>{if(idx===0&&node.nodeType===1&&node.classList&&node.classList.contains('title'))return; body.appendChild(node)});
    card.appendChild(head); card.appendChild(body);
  }
  function cleanRecovery(root){[...root.querySelectorAll('.card')].forEach(c=>{if(shouldRemove(c))c.remove()})}
  function collapseWorkout(){let root=$('workout'); if(!root)return; cleanRecovery(root)}
  function collapsePlan(){let root=$('plan'); if(!root)return; [...root.querySelectorAll('.card')].forEach((card,idx)=>{let t=titleOf(card); if(!t)return; let id='plan_'+idx+'_'+t.toLowerCase().replace(/[^a-z0-9]+/g,'_'); let meta='Plan Links section'; wrapCard(card,id,meta)})}
  function collapseStats(){let root=$('analytics'); if(!root)return; [...root.querySelectorAll('.card')].forEach((card,idx)=>{let t=titleOf(card); if(!t)return; let id='stats_'+idx+'_'+t.toLowerCase().replace(/[^a-z0-9]+/g,'_'); let meta='Stats section'; wrapCard(card,id,meta)})}
  const oldWorkout=renderWorkout; renderWorkout=function(){oldWorkout();collapseWorkout()}
  const oldPlan=renderPlan; renderPlan=function(){oldPlan();collapsePlan()}
  const oldAnalytics=renderAnalytics; renderAnalytics=function(){oldAnalytics();collapseStats()}
  setTimeout(()=>{try{collapseWorkout();collapsePlan();collapseStats()}catch(e){}},300)
})();