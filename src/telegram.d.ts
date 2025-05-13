// src/telegram.d.ts
export {}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            photo_url?: string
            language_code?: string
            is_premium?: boolean
          }
        }
        ready: () => void
        // Add more methods if needed
      }
    }
  }
}
