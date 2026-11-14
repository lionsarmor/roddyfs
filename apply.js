const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('open', !expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}));
const form = document.querySelector('#apply-form');
let preparedEmail = '';
const applyUrl = (location.hostname === 'roddyfs.com' || location.hostname === 'www.roddyfs.com' || location.hostname.startsWith('rfs.'))
  ? '/apply'
  : 'https://rfs.143-244-168-180.sslip.io/apply';
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('[type=submit]');
  const fields = new FormData(form);
  const value = key => String(fields.get(key) || '').trim();
  const payload = {
    name: value('name'),
    email: value('email'),
    phone: value('phone'),
    base: value('base'),
    pay: Number(value('pay') || 0),
    travel: value('travel'),
    availability: value('availability'),
    skills: value('skills'),
    certs: value('certs'),
    consent: true
  };
  const subject = `Technician bench: ${payload.name} — ${payload.base}`;
  preparedEmail = `Hello Roddy Field Services,\n\nI want to be considered for project field work.\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nHome base: ${payload.base}\nRequested pay: $${payload.pay}/hr\nTravel: ${payload.travel}\nAvailability: ${payload.availability || 'Not specified'}\nCertifications: ${payload.certs || 'None listed'}\nConsent to keep this information and contact me about projects: Yes\n\nSkills and experience:\n${payload.skills}\n\nI will attach my resume.\n\nThank you,\n${payload.name}`;
  button.disabled = true;
  try {
    const response = await fetch(applyUrl, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    const body = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(body.error || 'Could not save the application.');
    document.querySelector('#email-fallback').hidden = false;
    document.querySelector('#email-fallback p').textContent = 'Saved to the Roddy Field Services bench. Attach a resume in email if you want it on file, or you are done.';
  } catch (err) {
    document.querySelector('#email-fallback').hidden = false;
    document.querySelector('#email-fallback p').textContent = (err && err.message ? err.message + ' ' : '') + 'If that failed, send the prepared email to James@roddyfs.com and attach your resume.';
    window.location.href = `mailto:James@roddyfs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedEmail)}`;
  } finally {
    button.disabled = false;
  }
});
document.querySelector('#copy-details').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(preparedEmail);
    status.textContent = 'Copied.';
  } catch {
    let fallback = document.querySelector('#copy-fallback');
    if (!fallback) { fallback = document.createElement('textarea'); fallback.id = 'copy-fallback'; fallback.setAttribute('aria-label', 'Application details to copy'); document.querySelector('#email-fallback').append(fallback); }
    fallback.value = preparedEmail; fallback.focus(); fallback.select(); status.textContent = 'Select and copy the text below.';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
