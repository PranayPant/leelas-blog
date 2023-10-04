import * as React from "react"
import { useAuthStore } from "store/auth"
export function LoginButton({ children }: { children: React.ReactNode }) {
  const loginRedirect = useAuthStore(s => s.loginRedirect)
  return (
    <button id="login-wrapper" onClick={loginRedirect}>
      {children}
    </button>
  )
}
