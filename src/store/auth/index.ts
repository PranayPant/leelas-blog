import type { GetUserCommandOutput } from "@aws-sdk/client-cognito-identity-provider"
import { create } from "zustand"
import {
  FetchUserInfoResponse,
  fetchAccessToken,
  fetchUserInfo,
  getAuthorizeEndpoint,
  revokeTokens,
} from "./helpers"
import { RequestState } from "types/api"

interface AuthState {
  loginRedirect: VoidFunction
  logout: VoidFunction
  getToken: (code: string) => Promise<boolean>
  accessToken: string | undefined
  refreshToken: string | undefined
  idToken: string | undefined
  user: FetchUserInfoResponse | undefined
  pathBeforeLogin: string | undefined
  logoutState: RequestState
  loginState: RequestState
}
export const useAuthStore = create<AuthState>((set, get) => ({
  logoutState: RequestState.IDLE,
  loginState: RequestState.IDLE,
  loginRedirect: () => {
    set({ pathBeforeLogin: window.location.origin, loginState: RequestState.LOADING })
    window.location.assign(getAuthorizeEndpoint())
  },
  logout: async () => {
    const refreshToken = get().refreshToken
    if (!refreshToken) return
    try {
      set({ logoutState: RequestState.LOADING })
      await revokeTokens(refreshToken)
      set({
        logoutState: RequestState.SUCCESS,
        accessToken: undefined,
        refreshToken: undefined,
        idToken: undefined,
      })
    } catch (err) {
      set({ logoutState: RequestState.FAIL })
    }
  },
  getToken: async (code: string) => {
    try {
      set({ loginState: RequestState.LOADING })
      const { access_token, id_token, refresh_token } = await fetchAccessToken(
        code,
        get().accessToken,
      )
      const user = await fetchUserInfo(access_token)
      set({
        loginState: RequestState.SUCCESS,
        accessToken: access_token,
        idToken: id_token,
        refreshToken: refresh_token,
        user,
      })
    } catch (err) {
      set({ loginState: RequestState.FAIL })
      throw err
    }
    return true
  },
  accessToken: undefined,
  refreshToken: undefined,
  idToken: undefined,
  user: undefined,
  pathBeforeLogin: undefined,
}))
