import * as React from "react"

import Layout from "components/layout"
import Seo from "components/seo"
import { useAuthStore } from "store/auth"

const Login = () => {
  const getToken = useAuthStore(s => s.getToken)
  const redirectUri = useAuthStore(s => s.pathBeforeLogin)
  const getUser = useAuthStore(s => s.getUser)

  const initializeUser = React.useCallback(async () => {
    try {
      const search = new URL(window.location.href).searchParams
      const code = search.get("code")
      if (!code) throw new Error("invalid code")
      const token = await getToken(code)
      const user = await getUser()
      console.log(token, user)
      window.location.assign(redirectUri || "/")
    } catch (err) {
      window.location.assign("/")
    }
  }, [getToken, getUser, redirectUri])

  React.useEffect(() => {
    initializeUser()
  }, [initializeUser])
  return (
    <Layout>
      <h1>Logging in...</h1>
    </Layout>
  )
}

export const Head = () => <Seo title="Logging in..." />

export default Login
