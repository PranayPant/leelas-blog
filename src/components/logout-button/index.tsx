import * as React from "react"
import { useAuthStore } from "store/auth"
export function LogoutButton({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore(s => s.logout)
  return (
    <button id="login-wrapper" onClick={logout}>
      {children}
    </button>
  )
}
