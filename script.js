(function () {
  var cfg = window.HUB_CONFIG || {};
  var apps = cfg.apps || {};

  var rota = document.getElementById('card-rota');
  var control = document.getElementById('card-control');

  if (rota && apps.rota) rota.href = apps.rota;
  if (control && apps.control) control.href = apps.control;

  if (cfg.showEnvBanner) {
    var banner = document.getElementById('env-banner');
    if (banner) banner.hidden = false;
  }
})();
