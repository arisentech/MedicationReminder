const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withNativeSetup(config) {
  // 1. Force Lock Screen Awake
  config = withAndroidManifest(config, async (config) => {
    const mainActivity = config.modResults.manifest.application[0].activity.find(
      (act) => act.$['android:name'] === '.MainActivity'
    );
    if (mainActivity) {
      mainActivity.$['android:showWhenLocked'] = 'true';
      mainActivity.$['android:turnScreenOn'] = 'true';
    }
    return config;
  });

  // 2. Inject MP3 into Core Android OS
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const resDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res');
      const rawDir = path.join(resDir, 'raw');

      // Create the hidden raw folder if it doesn't exist
      if (!fs.existsSync(rawDir)) {
        fs.mkdirSync(rawDir, { recursive: true });
      }

      const soundSource = path.join(projectRoot, 'assets', 'alarm.mp3');
      const soundDest = path.join(rawDir, 'alarm.mp3');

      // Copy the MP3 so Android can play it natively
      if (fs.existsSync(soundSource)) {
        fs.copyFileSync(soundSource, soundDest);
      } else {
        console.error("CRITICAL: assets/alarm.mp3 NOT FOUND!");
      }
      return config;
    },
  ]);

  return config;
};