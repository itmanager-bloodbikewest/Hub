// Environment config for the BloodBikeWest Hub.
// Same file on both `main` and `dev` branches — behaviour is decided at
// runtime by which hostname was actually used to reach the page, not by
// which branch/deploy served it.
(function () {
  var isDev = location.hostname.startsWith('dev.');

  window.HUB_CONFIG = {
    environment: isDev ? 'development' : 'production',
    showEnvBanner: isDev,
    apps: {
      rota:    isDev ? 'https://dev.rota.bloodbikewest.ie' : 'https://rota.bloodbikewest.ie',
      control: isDev ? 'https://dev.app.bloodbikewest.ie'  : 'https://app.bloodbikewest.ie'
    },
    api: {
      // Rota's script owns the real password check + token issuance.
      rota: 'https://script.google.com/macros/s/AKfycbzUypl9uE-N5cb9LQglMoCzQZDATWfgoxX_hWNQ-a3WVndP6cl24tHzIa99kEI_RTk-/exec',
      // Control Centre's script owns the role/controller/rider lookup.
      control: 'https://script.google.com/macros/s/AKfycbwHprLnINj0zBWj8EfDh3dgEuFKhYS7RiRQHgjUE2fvDn8w38YFe4MYCcF4Q69RJLTcaw/exec'
    }
  };
})();
