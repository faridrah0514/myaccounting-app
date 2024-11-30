// types/next-auth.d.ts

import 'next-auth'

declare module 'next-auth' {
  interface User {
    username?: string
    role?: string
    name?: string
  }

  interface Session {
    user: {
      id?: number
      username?: string
      role?: string
      name?: string
    }
  }

  interface Token {
    username?: string
    role?: string
  }
}
