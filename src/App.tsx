import { type FC, useMemo } from 'react';
import {
  initDataRaw as _initDataRaw,
  initDataState as _initDataState,
  type User,
  useSignal,
} from '@telegram-apps/sdk-react';

// minimal row shape so TS is happy
type DisplayDataRow = { title: string; value: unknown };

function getUserRows(user: User): DisplayDataRow[] {
  return Object.entries(user).map(([title, value]) => ({ title, value }));
}

export const InitDataPage: FC = () => {
  const initDataRaw   = useSignal(_initDataRaw);
  const initDataState = useSignal(_initDataState);

  const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initDataState || !initDataRaw) return;
    return [
      { title: 'raw', value: initDataRaw },
      ...Object.entries(initDataState).reduce<DisplayDataRow[]>((acc, [title, value]) => {
        if (value instanceof Date) acc.push({ title, value: value.toISOString() });
        else if (!value || typeof value !== 'object') acc.push({ title, value });
        return acc;
      }, []),
    ];
  }, [initDataState, initDataRaw]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(
    () => (initDataState?.user ? getUserRows(initDataState.user) : undefined),
    [initDataState],
  );

  const receiverRows = useMemo<DisplayDataRow[] | undefined>(
    () => (initDataState?.receiver ? getUserRows(initDataState.receiver) : undefined),
    [initDataState],
  );

  const chatRows = useMemo<DisplayDataRow[] | undefined>(
    () =>
      initDataState?.chat
        ? Object.entries(initDataState.chat).map(([title, value]) => ({ title, value }))
        : undefined,
    [initDataState],
  );

  // bail if we’ve got no data
  if (!initDataRows) return null;

  // plug your own UI / renderer here; for now we just spit to the console
  console.log({ initDataRows, userRows, receiverRows, chatRows });
  return null;
};

export default InitDataPage;