import { useEffect, useState } from 'react'

type WebAppUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
  is_premium?: boolean
}

function App() {
  const [user, setUser] = useState<WebAppUser | null>(null)

  useEffect(() => {
    const tg = window.Telegram.WebApp
    tg.ready()

    // WARNING: This is not validated — for real apps, use tg.initData and validate server-side
    const unsafeData = tg.initDataUnsafe?.user
    if (unsafeData) {
      setUser(unsafeData)
    }
  }, [])

  return (
    <div className="p-4">
      <h1>Telegram Mini App Test</h1>
      {user ? (
        <div>
          <p>Hello, {user.first_name} (@{user.username})</p>
          {user.photo_url && (
            <img
              src={user.photo_url}
              alt="User profile"
              style={{ width: 100, borderRadius: '50%' }}
            />
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  )
}
export default App
