(function () {
  var MAIL = '<a href="mailto:hello@callworthyaeo.com">hello@callworthyaeo.com</a>';
  document.querySelectorAll('form.lead-form').forEach(function (form) {
    var status = form.querySelector('.form__status');
    var btn = form.querySelector('button[type="submit"]');
    function say(msg, err, html) {
      status.className = 'form__status' + (err ? ' err' : '');
      if (html) { status.innerHTML = msg; } else { status.textContent = msg; }
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements._gotcha && form.elements._gotcha.value) return;
      var site = form.elements.website, name = form.elements.name, email = form.elements.email;
      var url = site.value.trim();
      if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url;
      if (!url) { say('Please enter your website URL.', true); site.focus(); return; }
      try { var u = new URL(url); if (!/\.[a-z]{2,}$/i.test(u.hostname)) throw 0; } catch (x) { say('Please enter a valid website URL, for example example.com.', true); site.focus(); return; }
      site.value = url;
      if (!name.value.trim()) { say('Please enter your name.', true); name.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { say('Please enter a valid email address.', true); email.focus(); return; }
      say('', false);
      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = 'Sending...';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { window.location.href = '/thank-you'; return; }
          throw new Error('bad');
        })
        .catch(function () {
          say('The form could not be sent right now. Email ' + MAIL + ' instead.', true, true);
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  });
})();
