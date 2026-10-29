/* First-party anonymous traffic signals. No admin credential or form contents. */
(()=>{
  const endpoint='https://admin.roddyfs.com/collect';
  const pref='rfs-analytics-disabled';
  const disabled=()=>navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true||localStorage.getItem(pref)==='1';
  const uuid=()=>{if(crypto.randomUUID)return crypto.randomUUID();const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;const h=[...b].map(x=>x.toString(16).padStart(2,'0')).join('');return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)};
  let session;
  try{session=sessionStorage.getItem('rfs-visit-session');if(!/^[a-f0-9-]{36}$/.test(session||'')){session=uuid();sessionStorage.setItem('rfs-visit-session',session)}}catch{return}
  const send=event=>{try{if(disabled()||document.visibilityState==='prerender')return;let referrer='';try{referrer=new URL(document.referrer).hostname;if(['roddyfs.com','www.roddyfs.com'].includes(referrer))referrer=''}catch{};fetch(endpoint,{method:'POST',mode:'cors',credentials:'omit',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({id:uuid(),session,event,referrer,device:innerWidth<768?'mobile':innerWidth<1100?'tablet':'desktop'})}).catch(()=>{})}catch{}};
  if(location.pathname==='/'||location.pathname==='/index.html')send('pageview');
  document.addEventListener('click',ev=>{const a=ev.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(href.startsWith('mailto:'))send('email_click');else if(href.startsWith('tel:'))send('phone_click');else if(a.dataset.serviceLink==='Project staffing and crew sourcing')send('staffing_click')});
  document.querySelector('#quote-form')?.addEventListener('submit',ev=>{if(ev.target.checkValidity())send('inquiry_prepare')});
  const toggle=document.querySelector('#analytics-toggle');
  if(toggle){const label=()=>{try{toggle.textContent=disabled()?'Visitor counting is off on this browser':'Turn off visitor counting on this browser'}catch{toggle.textContent='Visitor counting unavailable'}};label();toggle.addEventListener('click',()=>{try{localStorage.setItem(pref,'1');label()}catch{}})}
})();
