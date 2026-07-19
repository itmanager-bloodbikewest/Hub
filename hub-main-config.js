// Environment config for the BloodBikeWest Hub
// This file is intentionally different between the `main` and `dev` branches.
window.HUB_CONFIG = {
  environment: "production",
  showEnvBanner: false,
  apps: {
    rota: "https://rota.bloodbikewest.ie",
    control: "https://app.bloodbikewest.ie"
  },
  api: {
    // Rota's script owns the real password check + token issuance.
    rota: "https://script.google.com/macros/s/AKfycbzUypl9uE-N5cb9LQglMoCzQZDATWfgoxX_hWNQ-a3WVndP6cl24tHzIa99kEI_RTk-/exec",
    // Control Centre's script owns the role/controller/rider lookup.
    control: "https://script.google.com/macros/s/AKfycbwHprLnINj0zBWj8EfDh3dgEuFKhYS7RiRQHgjUE2fvDn8w38YFe4MYCcF4Q69RJLTcaw/exec"
  }
};
