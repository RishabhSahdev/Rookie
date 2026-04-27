// Safety patch: make sure Today's Workout always appears on the Log Workout page.
(function(){
  function E(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function ensure(){if(!state.lastSession)state.lastSession=null;if(!state.sectionCollapsed)state.sectionCollapsed={};}
  function suggested(){ensure();let l=state.lastSession;if(!l)return {week:state.week,session:state.session};let s=+l.session+1,w=+l.week;if(s>=SESS.length){s=0;w=Math.min(12,w+1)}return {week:w,session:s}}
  window.openSuggestedWorkout=()=>{let nx=suggested();state.week=nx.week;state.session=nx.session;save();renderWorkout()}
  window.completeCurrentWorkout=()=>{state.lastSession={week:state.week,session:state.session,at:new Date().toISOString()};save(true);renderWorkout()}
  window.toggleTodaySection=()=>{ensure();state.sectionCollapsed.todayWorkout=!state.sectionCollapsed.todayWorkout;save();renderWorkout()}
  function todayCard(){let nx=suggested(),collapsed=!!(state.sectionCollapsed&&state.sectionCollapsed.todayWorkout);let body=collapsed?'':`<div class=collapseContent><p class=meta>Suggested next session: <b>Week ${nx.week} • ${E(SESS[nx.session][0])}</b></p><div class=quickbar><button class=primary onclick="openSuggestedWorkout()">Open Suggested</button><button onclick="completeCurrentWorkout()">Mark Current Complete</button></div></div>`;return `<div class="card ${collapsed?'sectionCollapsed':''}" id="todayWorkoutCard"><div class=sectionHeader><div><div class=title>Today’s Workout</div><div class=sectionMiniMeta>Suggested: Week ${nx.week} • ${E(SESS[nx.session][0])}</div></div><button class=sectionCollapseBtn onclick="toggleTodaySection()">${collapsed?'Expand':'Minimize'}</button></div>${body}</div>`}
  function cleanup(root){[...root.querySelectorAll('.card')].forEach(c=>{let t=(c.querySelector('.title')?.textContent||'').toLowerCase();if(t.includes('pain')||t.includes('discomfort'))c.remove()})}
  function inject(){let root=document.getElementById('workout');if(!root||root.classList.contains('hidden'))return;cleanup(root);let existing=[...root.querySelectorAll('.title')].some(t=>t.textContent.trim().toLowerCase().includes('today'));if(!existing){let savebar=root.querySelector('.savebar');if(savebar)savebar.insertAdjacentHTML('afterend',todayCard());else root.insertAdjacentHTML('afterbegin',todayCard())}}
  const prev=renderWorkout;renderWorkout=function(){prev();inject()}
  setTimeout(inject,300);
})();