(() => {
  'use strict';

  const cfg = window.LHISD_TIP_CONFIG || {};

  const form = document.getElementById('tipForm');
  const btn = document.getElementById('submitBtn');
  const error = document.getElementById('formError');
  const sent = document.getElementById('sentState');
  const another = document.getElementById('anotherBtn');
  const narrative = document.getElementById('narrative');
  const counter = document.getElementById('counter');
  const reportId = document.getElementById('reportId');

  let activeSubmissionToken = null;

  if (
    !cfg.endpoint ||
    !/^https:\/\/.+\.workers\.dev\/?$/.test(cfg.endpoint)
  ) {
    fail('The submission service is not configured.');
    btn.disabled = true;
    return;
  }

  narrative.addEventListener('input', () => {
    counter.textContent =
      `${narrative.value.length.toLocaleString()} / 10,000`;
  });

  setClientMetadata();

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    clear();

    if (!form.checkValidity()) {
      markInvalid();
      fail('Please complete all required fields before submitting.');
      form.querySelector(':invalid')?.focus();
      return;
    }

    if (document.getElementById('website').value) {
      fail('Unable to submit this report.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Submitting…';

    if (!activeSubmissionToken) {
      activeSubmissionToken = createSubmissionToken();
    }

    const formData = new FormData(form);

    const payload = {
      concernType: String(formData.get('concernType') || '').trim(),
      category: String(formData.get('category') || '').trim(),
      campus: String(formData.get('campus') || '').trim(),
      narrative: String(formData.get('narrative') || '').trim(),
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      website: String(formData.get('website') || '').trim(),
      userAgent: navigator.userAgent || '',
      sourcePage: location.href.split('#')[0],
      submissionToken: activeSubmissionToken
    };

    try {
      const response = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });

      let data;

      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(
          'The submission service returned an invalid response.'
        );
      }

      if (
        !response.ok ||
        !data ||
        data.success !== true ||
        data.stored !== true ||
        !/^AR-\d{4}-\d{6}$/.test(String(data.reportId || ''))
      ) {
        throw new Error(
          data && data.message
            ? data.message
            : 'Your report was not stored. Please try again.'
        );
      }

      reportId.textContent = data.reportId;
      form.hidden = true;
      sent.hidden = false;
      sent.focus();
      activeSubmissionToken = null;

    } catch (submissionError) {
      console.error('Tip submission failed:', submissionError);
      resetButton();
      fail(
        'We could not confirm that your report was stored. ' +
        'Please try again.'
      );
    }
  });

  another.addEventListener('click', () => {
    sent.hidden = true;
    form.hidden = false;
    form.reset();
    counter.textContent = '0 / 10,000';
    activeSubmissionToken = null;
    setClientMetadata();
    resetButton();
    clear();
    document.getElementById('concernType').focus();
  });

  form.addEventListener('input', (e) => {
    if (
      e.target.matches('[aria-invalid="true"]') &&
      e.target.checkValidity()
    ) {
      e.target.removeAttribute('aria-invalid');
    }

    if (!error.hidden) {
      error.hidden = true;
    }
  });

  function setClientMetadata() {
    const userAgentField = document.getElementById('clientUserAgent');
    const sourcePageField = document.getElementById('sourcePage');

    if (userAgentField) {
      userAgentField.value = navigator.userAgent || '';
    }

    if (sourcePageField) {
      sourcePageField.value = location.href.split('#')[0];
    }
  }

  function createSubmissionToken() {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID === 'function'
    ) {
      return window.crypto.randomUUID();
    }

    return (
      Date.now().toString(36) +
      '-' +
      Math.random().toString(36).slice(2) +
      '-' +
      Math.random().toString(36).slice(2)
    );
  }

  function resetButton() {
    btn.disabled = false;
    btn.textContent = 'Submit tip';
  }

  function markInvalid() {
    form
      .querySelectorAll('input, select, textarea')
      .forEach((field) => {
        if (!field.checkValidity()) {
          field.setAttribute('aria-invalid', 'true');
        }
      });
  }

  function clear() {
    form
      .querySelectorAll('[aria-invalid="true"]')
      .forEach((field) => {
        field.removeAttribute('aria-invalid');
      });

    error.hidden = true;
    error.textContent = '';
  }

  function fail(message) {
    error.textContent = message;
    error.hidden = false;
  }
})();
