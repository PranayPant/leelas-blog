import * as React from "react"
import { Link } from "gatsby"

import Layout from "components/layout"
import Seo from "components/seo"
import { useAuthStore } from "store/auth"

const Login = () => {
  const getToken = useAuthStore(s => s.getToken)
  const redirectUri = useAuthStore(s => s.pathBeforeLogin)
  React.useEffect(() => {
    const search = new URL(window.location.href).searchParams
    const code = search.get("code")
    if (code) {
      getToken(code)
        .then(() => window.location.assign(redirectUri || "/"))
        .catch(err => {
          window.location.assign("/")
        })
    } else {
      window.location.assign("/")
    }
  }, [getToken, redirectUri])
  return (
    <Layout>
      <h1>
        This page is <b>rendered server-side</b>
      </h1>
      <p>
        This page is rendered server side every time the page is requested. Reload it to see
        a(nother) random photo from <code>dog.ceo/api/breed/shiba/images/random</code>:
      </p>
      <img style={{ width: "320px", borderRadius: "var(--border-radius)" }} alt="A random dog" />
      <p>
        To learn more, head over to our{" "}
        <a href="https://www.gatsbyjs.com/docs/reference/rendering-options/server-side-rendering/">
          documentation about Server Side Rendering
        </a>
        .
      </p>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
}

export const Head = () => <Seo title="Logging in..." />

export default Login
