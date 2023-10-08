import * as React from "react"
import { useAuthStore } from "store/auth"
export function LoginButton({ children }: { children: React.ReactNode }) {
  const loginRedirect = useAuthStore(s => s.loginRedirect)
  const user = useAuthStore(s => s.user)
  return (
    <>
      {!user ? (
        <button id="login-wrapper" onClick={loginRedirect}>
          {children}
        </button>
      ) : (
        <span>Welcome, {user.preferred_username}</span>
      )}
    </>
  )
}
