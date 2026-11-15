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
const statusBox = document.querySelector('#apply-status');
const statusText = statusBox.querySelector('p');
const onDroplet = location.hostname.startsWith('rfs.') || location.hostname === 'apply.roddyfs.com';
const applyUrl = onDroplet ? '/apply' : 'https://admin.roddyfs.com/apply';
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('[type=submit]');
  const payload = new FormData(form);
  payload.set('consent', 'yes');
  payload.set('smsConsent', form.querySelector('[name=smsConsent]').checked ? 'yes' : 'no');
  button.disabled = true;
  statusBox.hidden = false;
  statusText.textContent = 'Sending your application…';
  try {
    const response = await fetch(applyUrl, {method: 'POST', body: payload});
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || 'Could not submit the application.');
    form.reset();
    statusText.textContent = body.mailed
      ? 'Application received. It was emailed to James@roddyfs.com and saved to our bench.'
      : 'Application saved to our bench. If you do not get a reply, email James@roddyfs.com.';
  } catch (err) {
    statusText.textContent = err.message || 'Could not submit the application.';
  } finally {
    button.disabled = false;
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
