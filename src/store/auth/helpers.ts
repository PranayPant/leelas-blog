export function getAuthorizeEndpoint() {
  const endpoint = process.env.GATSBY_COGNITO_AUTH_ENDPOINT as string
  const clientId = process.env.GATSBY_COGNITO_CLIENT_ID as string
  const redirect_uri = process.env.GATSBY_COGNITO_REDIRECT_URI as string
  const url = new URL(
    `?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`,
    endpoint,
  ).toString()
  return url
}

interface FetchAccessTokenResponse {
  access_token: string
  id_token: string
  refresh_token: string
  token_type: "Bearer"
  expires_in: number
}
export async function fetchAccessToken(
  code: string,
  refreshToken?: string,
): Promise<FetchAccessTokenResponse> {
  const endpoint = process.env.GATSBY_COGNITO_AUTH_ENDPOINT as string
  const clientId = process.env.GATSBY_COGNITO_CLIENT_ID as string
  const redirect_uri = process.env.GATSBY_COGNITO_REDIRECT_URI as string
  const uri = new URL("/oauth2/token", endpoint).toString()
  try {
    const res = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri,
        refresh_token: refreshToken,
        code,
      }),
    })
    return await res.json()
  } catch (err) {
    console.log("Error fetching access token:", err)
    throw err
  }
}

export interface FetchUserInfoResponse {
  email: string
  fullname: string
}
export async function fetchUserInfo(accessToken: string): Promise<FetchUserInfoResponse> {
  const endpoint = process.env.GATSBY_COGNITO_AUTH_ENDPOINT as string
  const uri = new URL("/oauth2/userInfo", endpoint).toString()
  try {
    const res = await fetch(uri, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return await res.json()
  } catch (err) {
    console.log("Error fetching access token:", err)
    throw err
  }
}

export async function revokeTokens(refreshToken: string) {
  const endpoint = process.env.GATSBY_COGNITO_AUTH_ENDPOINT as string
  const clientId = process.env.GATSBY_COGNITO_CLIENT_ID as string
  const uri = new URL("/oauth2/revoke", endpoint).toString()
  try {
    await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        token: refreshToken,
        client_id: clientId,
      }),
    })
  } catch (err) {
    console.log("Error revoking token:", err)
    throw err
  }
}
