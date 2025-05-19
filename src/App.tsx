import { useEffect, useState } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

type UserData = Record<string, string>;

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function authorize() {
      try {
        const { initDataRaw, initData } = retrieveLaunchParams();
        console.log(initData)
        console.log("initDataRaw:", initDataRaw);

        const res = await fetch('/api/auth/', {
          method: 'POST',
          headers: {
            Authorization: `tma ${initDataRaw}`,
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          setError(`Auth failed: ${errText}`);
          return;
        }

        const data: UserData = await res.json();
        setUserData(data);
      } catch (e: any) {
        setError(`Error: ${e.message || 'Unknown error'}`);
      }
    }

    authorize();
  }, []);

  if (error) return <div>Error: {error}</div>;

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Data</h1>
      <ul>
        {Object.entries(userData).map(([key, value]) => (
          <li key={key}>
            <b>{key}</b>: {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
