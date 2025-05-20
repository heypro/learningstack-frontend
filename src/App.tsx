import { useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  initDataRaw as _initDataRaw,
  initDataState as _initDataState,
  useSignal,
} from '@telegram-apps/sdk-react';

export const InitDataDebugPage: FC = () => {
  const initDataRaw = useSignal(_initDataRaw);
  const initDataState = useSignal(_initDataState);

  const [backendResponse, setBackendResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initDataRaw) return;

    // POST raw init data to backend
    (async () => {
      try {
        const res = await fetch('/api/auth/', {
          method: 'POST',
          headers: {
            Authorization: `tma ${initDataRaw}`,
          },
        });
        const data = await res.json().catch(() => null);
        setBackendResponse(data);
      } catch (e) {
        setError(String(e));
      }
    })();
  }, [initDataRaw]);

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h2>Debug: Init Data Raw</h2>
      <pre>{JSON.stringify(initDataRaw, null, 2)}</pre>

      <h2>Debug: Init Data State</h2>
      <pre>{JSON.stringify(initDataState, null, 2)}</pre>

      <h2>Backend Response</h2>
      <pre>{backendResponse ? JSON.stringify(backendResponse, null, 2) : 'Waiting for response...'}</pre>

      {error && (
        <>
          <h2>Error</h2>
          <pre>{error}</pre>
        </>
      )}
    </div>
  );
};

export default InitDataDebugPage;