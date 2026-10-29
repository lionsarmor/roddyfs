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
let preparedEmail = '';
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const value = key => String(fields.get(key) || '').trim();
  const subject = `Project inquiry: ${value('service')} — ${value('location')}`;
  preparedEmail = `Hello Roddy Field Services,\n\nI'd like to discuss a project.\n\nName: ${value('name')}\nEmail: ${value('email')}\nCompany: ${value('company') || 'Not specified'}\nProject location: ${value('location')}\nTarget timing: ${value('timing') || 'To be discussed'}\nService: ${value('service')}\n\nProject details:\n${value('details')}\n\nThank you,\n${value('name')}`;
  document.querySelector('#email-fallback').hidden = false;
  window.location.href = `mailto:jamesmweeksjr@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedEmail)}`;
});
document.querySelector('#copy-details').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(preparedEmail);
    status.textContent = 'Copied.';
  } catch {
    let fallback = document.querySelector('#copy-fallback');
    if (!fallback) { fallback = document.createElement('textarea'); fallback.id = 'copy-fallback'; fallback.setAttribute('aria-label', 'Project details to copy'); document.querySelector('#email-fallback').append(fallback); }
    fallback.value = preparedEmail; fallback.focus(); fallback.select(); status.textContent = 'Select and copy the text below.';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
