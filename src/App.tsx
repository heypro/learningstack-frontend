import React, { useEffect, useState } from 'react';

const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

const logAllWebAppStuff = (WebApp: any) => {
  if (!WebApp) {
    console.warn('Telegram.WebApp not found.');
    return;
  }

  // Log all top-level fields
  Object.keys(WebApp).forEach(key => {
    try {
      console.log(`[TG WebApp] ${key}:`, WebApp[key]);
    } catch (e) {
      console.error(`[TG WebApp] Error logging ${key}`, e);
    }
  });

  // Log initData and initDataUnsafe
  console.log('[TG WebApp] initData:', WebApp.initData);
  console.log('[TG WebApp] initDataUnsafe:', WebApp.initDataUnsafe);

  // List all functions and events that you might want to log (raw as hell)
  [
    'onEvent', 'offEvent', 'sendData', 'expand', 'close', 'showAlert', 'showConfirm', 'showPopup',
    'MainButton', 'BackButton', 'SettingsButton', 'HapticFeedback',
    'CloudStorage', 'DeviceStorage', 'SecureStorage', 'BiometricManager',
    'Accelerometer', 'DeviceOrientation', 'Gyroscope', 'LocationManager',
    'enableClosingConfirmation', 'disableClosingConfirmation', 'requestFullscreen', 'exitFullscreen'
  ].forEach(fn => {
    if (typeof WebApp[fn] === 'function' || typeof WebApp[fn] === 'object') {
      console.log(`[TG WebApp] Has ${fn}:`, WebApp[fn]);
    }
  });
};
declare global {
  interface Window {
    __tgWebApp?: any;
  }
}


const listenToAllEvents = (WebApp: any) => {
  if (!WebApp) return;

  // Telegram docs say use onEvent(event, handler)
  const events = [
    'themeChanged',
    'viewportChanged',
    'mainButtonClicked',
    'backButtonClicked',
    'settingsButtonClicked',
    'popupClosed',
    'invoiceClosed',
    'qrTextReceived',
    'clipboardTextReceived',
    'scanQrPopupClosed',
    // New API events (from 2024/2025 docs)
    'activated',
    'deactivated',
    'safeAreaChanged',
    'contentSafeAreaChanged',
    'fullscreenChanged',
    'fullscreenFailed',
    'homeScreenAdded',
    'homeScreenChecked',
    'emojiStatusSet',
    'emojiStatusFailed',
    'emojiStatusAccessRequested',
    'shareMessageSent',
    'shareMessageFailed',
    'fileDownloadRequested',
    'locationManagerUpdated',
    'locationRequested',
    'accelerometerStarted',
    'accelerometerStopped',
    'accelerometerChanged',
    'accelerometerFailed',
    'deviceOrientationStarted',
    'deviceOrientationStopped',
    'deviceOrientationChanged',
    'deviceOrientationFailed',
    'gyroscopeStarted',
    'gyroscopeStopped',
    'gyroscopeChanged',
    'gyroscopeFailed',
    'writeAccessRequested',
    'contactRequested'
  ];

  events.forEach(event => {
    try {
      WebApp.onEvent(event, (...args: any[]) => {
        console.log(`[TG WebApp] Event: ${event}`, ...args);
      });
    } catch (e) {
      // Fail silently if not available
    }
  });
};

const App: React.FC = () => {
  const [initData, setInitData] = useState<string>('');
  const [initDataUnsafe, setInitDataUnsafe] = useState<any>(null);

  useEffect(() => {
    const WebApp = getTelegramWebApp();
    if (WebApp) {
      // Log everything
      logAllWebAppStuff(WebApp);

      // Listen to all events
      listenToAllEvents(WebApp);

      // Set initData states
      setInitData(WebApp.initData);
      setInitDataUnsafe(WebApp.initDataUnsafe);

      // Hot reload support: log on updates too
      window.__tgWebApp = WebApp;
    } else {
      console.warn('window.Telegram.WebApp not loaded yet.');
    }
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Telegram Mini App Init Data</h1>

      <h2>initData (raw string):</h2>
      <pre style={{ background: '#222', color: '#6f6', padding: 16 }}>
        {initData || 'Not available'}
      </pre>

      <h2>initDataUnsafe (parsed object):</h2>
      <pre style={{ background: '#111', color: '#f6f', padding: 16 }}>
        {initDataUnsafe ? JSON.stringify(initDataUnsafe, null, 2) : 'Not available'}
      </pre>

      <h2>window.Telegram.WebApp (all fields):</h2>
      <pre style={{ background: '#333', color: '#fff', padding: 16, overflow: 'auto' }}>
        {typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp
          ? JSON.stringify(window.Telegram.WebApp, (key, value) => {
              if (typeof value === 'function') return '[Function]';
              return value;
            }, 2)
          : 'Not available'}
      </pre>
    </div>
  );
};

export default App;
