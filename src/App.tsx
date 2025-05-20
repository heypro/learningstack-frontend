import { useEffect, useState, useCallback } from 'react';
import type { FC } from "react";
import {
  initDataRaw as _initDataRaw,
  initDataState as _initDataState,
  useSignal,
} from '@telegram-apps/sdk-react';

/**
 * InitDataDebugPage ‑ max‑verbosity debug component.
 * Logs *everything* (state changes, effects, fetches, errors) to both the browser console
 * and an on‑screen "Event Log" so you can eyeball the entire execution path.
 * Tailwind is used for quick styling; feel free to tweak.
 */
export const InitDataDebugPage: FC = () => {
  // ----- Telegram init data -----
  const initDataRaw = useSignal(_initDataRaw);
  const initDataState = useSignal(_initDataState);

  // ----- Local state -----
  const [backendResponse, setBackendResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // ----- Event log -----
  interface LogEntry {
    ts: number;
    label: string;
    value: any;
  }
  const [logs, setLogs] = useState<LogEntry[]>([]);

  /**
   * push a new log entry (and mirror it to the dev‑console for good measure)
   */
  const log = useCallback((label: string, value: any) => {
    // stringify defensively so we don't choke on circular refs
    let safeValue: any;
    try {
      safeValue = JSON.parse(JSON.stringify(value));
    } catch {
      safeValue = String(value);
    }

    setLogs((prev) => [...prev, { ts: Date.now(), label, value: safeValue }]);
    // eslint‑disable‑next‑line no-console
    console.debug(`[InitDataDebug] ${label}:`, value);
  }, []);

  // ---- watch initDataRaw ----
  useEffect(() => {
    log('initDataRaw changed', initDataRaw);
  }, [initDataRaw, log]);

  // ---- watch initDataState ----
  useEffect(() => {
    log('initDataState changed', initDataState);
  }, [initDataState, log]);

  // ---- backend fetch ----
  useEffect(() => {
    if (!initDataRaw) {
      log('fetch skipped', 'initDataRaw is empty');
      return;
    }

    (async () => {
      log('fetch → start', { endpoint: '/api/auth/', token: initDataRaw });
      try {
        const res = await fetch('/api/auth/', {
          method: 'POST',
          headers: {
            Authorization: `tma ${initDataRaw}`,
          },
        });
        const data = await res.json().catch(() => null);
        setBackendResponse(data);
        log('fetch → success', data);
      } catch (e) {
        const err = String(e);
        setError(err);
        log('fetch → error', err);
      }
    })();
  }, [initDataRaw, log]);

  // ---- helpers ----
  const renderJson = (obj: any) =>
    obj !== undefined && obj !== null ? JSON.stringify(obj, null, 2) : 'null';

  // ---- UI ----
  return (
    <div className="p-6 font-mono space-y-8">
      <section>
        <h2 className="text-xl font-bold">Init Data Raw</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          {renderJson(initDataRaw)}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-bold">Init Data State</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          {renderJson(initDataState)}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-bold">Backend Response</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
          {backendResponse ? renderJson(backendResponse) : 'Waiting for response…'}
        </pre>
      </section>

      {error && (
        <section>
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <pre className="bg-red-50 p-2 rounded overflow-x-auto">{error}</pre>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold">Event Log</h2>
        <div className="flex flex-col gap-2">
          {logs.map((l, idx) => (
            <pre
              key={idx}
              className="bg-gray-50 p-2 rounded overflow-x-auto"
            >{`${new Date(l.ts).toISOString()} — ${l.label}: ${renderJson(l.value)}`}</pre>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InitDataDebugPage;
