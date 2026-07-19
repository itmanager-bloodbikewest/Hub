(function () {
  var cfg = window.HUB_CONFIG || {};
  var apps = cfg.apps || {};
  var api = cfg.api || {};

  // ── Shared session cookie (same scheme as Rota / Command Centre) ──
  var SESSION_COOKIE = 'bbw_session';

  function cookieDomain() {
    return location.hostname.endsWith('bloodbikewest.ie') ? '.bloodbikewest.ie' : '';
  }
  function setCookie(name, value, days) {
    var domain = cookieDomain();
    var str = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + (days*24*60*60) + '; SameSite=Lax; Secure';
    if (domain) str += '; domain=' + domain;
    document.cookie = str;
  }
  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function deleteCookie(name) {
    var domain = cookieDomain();
    var str = name + '=; path=/; max-age=0; SameSite=Lax; Secure';
    if (domain) str += '; domain=' + domain;
    document.cookie = str;
  }
  function readSession() {
    try {
      var raw = getCookie(SESSION_COOKIE);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.user || !parsed.user.name) return null;
      return parsed;
    } catch (e) { return null; }
  }

  // ── Backend calls ──
  function normalizePhone(p) { return String(p).replace(/[\s\-()+]/g, '').trim(); }

  function rotaLogin(phone, password) {
    var url = new URL(api.rota);
    url.searchParams.set('action', 'login');
    url.searchParams.set('phone', phone);
    url.searchParams.set('password', password);
    return fetch(url.toString(), { method: 'GET' }).then(function (res) { return res.text(); }).then(function (text) {
      try { return JSON.parse(text); } catch (e) { throw new Error('Invalid response from Rota: ' + text.slice(0, 100)); }
    });
  }

  function getUserRole(phone) {
    var url = new URL(api.control);
    url.searchParams.set('action', 'getUserRole');
    url.searchParams.set('data', JSON.stringify({ phone: phone }));
    return fetch(url.toString(), { method: 'GET' }).then(function (res) { return res.text(); }).then(function (text) {
      try { return JSON.parse(text); } catch (e) { throw new Error('Invalid response from Control Centre: ' + text.slice(0, 100)); }
    });
  }

  // ── DOM ──
  var loginScreen  = document.getElementById('login-screen');
  var appContent   = document.getElementById('app-content');
  var phoneInput   = document.getElementById('login-phone');
  var passInput    = document.getElementById('login-password');
  var errorEl      = document.getElementById('login-error');
  var submitBtn    = document.getElementById('login-submit');
  var signedInName = document.getElementById('signed-in-name');
  var logoutBtn    = document.getElementById('logout-btn');
  var rotaCard     = document.getElementById('card-rota');
  var controlCard  = document.getElementById('card-control');

  if (rotaCard && apps.rota) rotaCard.href = apps.rota;
  if (controlCard && apps.control) controlCard.href = apps.control;

  if (cfg.showEnvBanner) {
    var banner = document.getElementById('env-banner');
    if (banner) banner.hidden = false;
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }
  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = '';
  }

  function showApp(session) {
    loginScreen.hidden = true;
    appContent.hidden = false;
    signedInName.textContent = session.user.name;
  }
  function showLogin() {
    appContent.hidden = true;
    loginScreen.hidden = false;
    phoneInput.focus();
  }

  function handleLogin() {
    var phone = normalizePhone(phoneInput.value);
    var password = passInput.value;
    clearError();
    if (!phone)    { showError('Please enter your phone number.'); return; }
    if (!password) { showError('Please enter the password.'); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    rotaLogin(phone, password).then(function (loginRes) {
      if (loginRes.error) { throw new Error(loginRes.error); }
      return getUserRole(phone).then(function (roleRes) {
        if (!roleRes.found) { throw new Error('Phone number not recognised. Please contact your administrator.'); }
        var session = {
          token: loginRes.token,
          user: {
            name: roleRes.name,
            phone: phone,
            role: roleRes.role,
            controllers: roleRes.controllers || [],
            riders: roleRes.riders || []
          },
          savedAt: Date.now()
        };
        setCookie(SESSION_COOKIE, JSON.stringify(session), 30);
        showApp(session);
      });
    }).catch(function (err) {
      showError(err.message || 'Could not sign in. Please try again.');
    }).finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign in';
    });
  }

  function handleLogout() {
    deleteCookie(SESSION_COOKIE);
    showLogin();
  }

  submitBtn.addEventListener('click', handleLogin);
  passInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') handleLogin(); });
  phoneInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') passInput.focus(); });
  logoutBtn.addEventListener('click', handleLogout);

  // ── Boot ──
  var existing = readSession();
  if (existing) { showApp(existing); } else { showLogin(); }
})();
