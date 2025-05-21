import { createContext, useContext, useEffect, useState } from "react";

const InitDataCtx = createContext(null);

export function useInitData() {
  return useContext(InitDataCtx);
}

export function InitDataProvider({ children }) {
  const [initData, setInitData] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    // pull once, then leave it
    setInitData(tg.initData || null);
    tg.ready?.();
  }, []);

  return (
    <InitDataCtx.Provider value={initData}>{children}</InitDataCtx.Provider>
  );
}
