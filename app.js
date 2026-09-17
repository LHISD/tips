(() => {
  'use strict';
  const cfg = window.LHISD_TIP_CONFIG || {};
  const form = document.getElementById('tipForm');
  const frame = document.getElementById('submissionFrame');
  const btn = document.getElementById('submitBtn');
  const error = document.getElementById('formError');
  const sent = document.getElementById('sentState');
  const another = document.getElementById('anotherBtn');
  const narrative = document.getElementById('narrative');
  const counter = document.getElementById('counter');
  const reportId = document.getElementById('reportId');
  let timer = null;

  if (!cfg.endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(cfg.endpoint)) {
    fail('The submission service is not configured.'); btn.disabled = true; return;
  }

  narrative.addEventListener('input', () => counter.textContent = `${narrative.value.length.toLocaleString()} / 10,000`);
  document.getElementById('clientUserAgent').value = navigator.userAgent || '';
  document.getElementById('sourcePage').value = location.href.split('#')[0];

  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); clear();
    if (!form.checkValidity()) { markInvalid(); fail('Please complete all required fields before submitting.'); form.querySelector(':invalid')?.focus(); return; }
    if (document.getElementById('website').value) { fail('Unable to submit this report.'); return; }

    btn.disabled = true; btn.textContent = 'Submitting…';
    const payload = new URLSearchParams(new FormData(form));
    const temp = document.createElement('form');
    temp.method = 'POST'; temp.action = cfg.endpoint; temp.target = 'submissionFrame'; temp.hidden = true;
    for (const [key, value] of payload.entries()) { const input = document.createElement('input'); input.name = key; input.value = value; temp.appendChild(input); }
    document.body.appendChild(temp); temp.submit(); temp.remove();

    timer = setTimeout(() => { resetButton(); fail('We could not confirm that your report was stored. Please try again.'); }, 15000);
  });

  window.addEventListener('message', (event) => {
    if (!cfg.allowedMessageOrigins.includes(event.origin)) return;
    const data = event.data || {};
    if (data.source !== 'lhisd-tip-intake') return;
    clearTimeout(timer);
    if (data.success && data.stored && data.reportId) {
      reportId.textContent = data.reportId; form.hidden = true; sent.hidden = false; sent.focus();
    } else { resetButton(); fail(data.message || 'Your report was not stored. Please try again.'); }
  });

  another.addEventListener('click', () => { sent.hidden = true; form.hidden = false; form.reset(); counter.textContent = '0 / 10,000'; document.getElementById('clientUserAgent').value = navigator.userAgent || ''; document.getElementById('sourcePage').value = location.href.split('#')[0]; resetButton(); clear(); document.getElementById('concernType').focus(); });
  form.addEventListener('input', e => { if (e.target.matches('[aria-invalid="true"]') && e.target.checkValidity()) e.target.removeAttribute('aria-invalid'); if (!error.hidden) error.hidden = true; });

  function resetButton(){ btn.disabled = false; btn.textContent = 'Submit test tip'; }
  function markInvalid(){ form.querySelectorAll('input,select,textarea').forEach(f => { if (!f.checkValidity()) f.setAttribute('aria-invalid','true'); }); }
  function clear(){ form.querySelectorAll('[aria-invalid="true"]').forEach(f => f.removeAttribute('aria-invalid')); error.hidden = true; error.textContent = ''; }
  function fail(msg){ error.textContent = msg; error.hidden = false; }
})();
