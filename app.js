(() => {
  'use strict';

  const config = window.LHISD_TIP_CONFIG || {};
  const form = document.getElementById('tipForm');
  const frame = document.getElementById('submissionFrame');
  const submitBtn = document.getElementById('submitBtn');
  const errorBox = document.getElementById('formError');
  const sentState = document.getElementById('sentState');
  const anotherBtn = document.getElementById('anotherBtn');
  const narrative = document.getElementById('narrative');
  const counter = document.getElementById('counter');

  let awaitingResponse = false;
  let fallbackTimer = null;

  if (!config.endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(config.endpoint)) {
    showError('The TEST submission endpoint is not configured correctly.');
    submitBtn.disabled = true;
  } else {
    form.action = config.endpoint;
  }

  narrative.addEventListener('input', () => {
    counter.textContent = `${narrative.value.length.toLocaleString()} / 10,000`;
  });

  form.addEventListener('submit', (event) => {
    clearValidation();

    if (!form.checkValidity()) {
      event.preventDefault();
      markInvalidFields();
      showError('Please complete all required fields before submitting.');
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (document.getElementById('website').value) {
      event.preventDefault();
      showSentState();
      return;
    }

    awaitingResponse = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Apps Script web apps are cross-origin from GitHub Pages. A native POST
    // to a hidden iframe avoids relying on browser CORS access to the JSON body.
    // The iframe load tells us the endpoint returned; the TEST spreadsheet is
    // the authoritative verification that the row was actually stored.
    fallbackTimer = window.setTimeout(() => {
      if (awaitingResponse) showSentState();
    }, 4500);
  });

  frame.addEventListener('load', () => {
    if (!awaitingResponse) return;
    window.clearTimeout(fallbackTimer);
    showSentState();
  });

  anotherBtn.addEventListener('click', () => {
    sentState.hidden = true;
    form.hidden = false;
    form.reset();
    counter.textContent = '0 / 10,000';
    clearValidation();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit test tip';
    document.getElementById('concernType').focus();
  });

  form.addEventListener('input', (event) => {
    if (event.target.matches('[aria-invalid="true"]') && event.target.checkValidity()) {
      event.target.removeAttribute('aria-invalid');
    }
    if (!errorBox.hidden) errorBox.hidden = true;
  });

  function markInvalidFields() {
    form.querySelectorAll('input,select,textarea').forEach((field) => {
      if (!field.checkValidity()) field.setAttribute('aria-invalid', 'true');
    });
  }

  function clearValidation() {
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function showSentState() {
    awaitingResponse = false;
    window.clearTimeout(fallbackTimer);
    form.hidden = true;
    sentState.hidden = false;
    sentState.focus();
  }
})();
