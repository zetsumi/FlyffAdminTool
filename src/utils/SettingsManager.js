import Settings from 'electron-settings';
import path from 'path';

const KEYS = {
  EXECUTABLES: 'executables',
  LOCALE: 'locale',
  METRICS_SETTINGS: 'metricsSettings',
};

Settings.setPath(path.join(path.dirname(Settings.file()), 'config.json'));

export default {
  getSettingsPath() {
    return Settings.file();
  },
  getExecutables() {
    return Settings.get(KEYS.EXECUTABLES);
  },
  setExecutables(settings) {
    return Settings.set(KEYS.EXECUTABLES, settings);
  },
  getLocale() {
    return Settings.get(KEYS.LOCALE);
  },
  setLocale(settings) {
    return Settings.set(KEYS.LOCALE, settings);
  },
  getMetricsSettings() {
    return Settings.get(KEYS.METRICS_SETTINGS);
  },
  setMetricsSettings(settings) {
    return Settings.set(KEYS.METRICS_SETTINGS, settings);
  },
};
