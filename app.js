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
document.querySelectorAll('[data-service-link]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#service-select').value = link.dataset.serviceLink;
}));
const form = document.querySelector('#quote-form');
const contactUrl = (location.hostname === 'roddyfs.com' || location.hostname === 'www.roddyfs.com' || location.hostname.startsWith('rfs.'))
  ? '/contact'
  : 'https://rfs.143-244-168-180.sslip.io/contact';
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('[type=submit]');
  const fields = new FormData(form);
  const value = key => String(fields.get(key) || '').trim();
  const payload = {
    name: value('name'),
    email: value('email'),
    company: value('company'),
    location: value('location'),
    timing: value('timing'),
    service: value('service'),
    details: value('details')
  };
  const status = document.querySelector('#copy-status');
  button.disabled = true;
  document.querySelector('#email-fallback').hidden = false;
  status.textContent = 'Sending…';
  try {
    const response = await fetch(contactUrl, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || 'Could not send the inquiry.');
    form.reset();
    document.querySelector('#email-fallback p').textContent = body.mailed
      ? 'Inquiry sent to James@roddyfs.com. We will reply from that address.'
      : 'Inquiry saved. If you do not hear back, email James@roddyfs.com.';
    status.textContent = '';
  } catch (err) {
    document.querySelector('#email-fallback p').textContent = err.message || 'Could not send the inquiry.';
    status.textContent = '';
  } finally {
    button.disabled = false;
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
