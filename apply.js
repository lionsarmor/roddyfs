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
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const value = key => String(fields.get(key) || '').trim();
  const subject = `Technician bench: ${value('name')} — ${value('base')}`;
  preparedEmail = `Hello Roddy Field Services,\n\nI want to be considered for project field work.\n\nName: ${value('name')}\nEmail: ${value('email')}\nPhone: ${value('phone')}\nHome base: ${value('base')}\nRequested pay: $${value('pay')}/hr\nTravel: ${value('travel')}\nAvailability: ${value('availability') || 'Not specified'}\nCertifications: ${value('certs') || 'None listed'}\nConsent to keep this information and contact me about projects: Yes\n\nSkills and experience:\n${value('skills')}\n\nI will attach my resume.\n\nThank you,\n${value('name')}`;
  document.querySelector('#email-fallback').hidden = false;
  window.location.href = `mailto:James@roddyfs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedEmail)}`;
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
