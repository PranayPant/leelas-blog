import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { mountStoreDevtool } from "simple-zustand-devtools"
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
  getToken: (code: string) => Promise<string | undefined>
  getUser: () => Promise<FetchUserInfoResponse | undefined>
  accessToken: string | undefined
  refreshToken: string | undefined
  idToken: string | undefined
  user: FetchUserInfoResponse | undefined
  pathBeforeLogin: string | undefined
  logoutState: RequestState
  loginState: RequestState
}
export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
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
          set({
            loginState: RequestState.SUCCESS,
            accessToken: access_token,
            idToken: id_token,
            refreshToken: refresh_token,
          })
          return access_token
        } catch (err) {
          set({ loginState: RequestState.FAIL })
          throw err
        }
      },
      getUser: async () => {
        const accessToken = get().accessToken
        if (!accessToken) return
        try {
          set({ loginState: RequestState.LOADING })
          const user = await fetchUserInfo(accessToken)
          set({
            loginState: RequestState.SUCCESS,
            user,
          })
          return user
        } catch (err) {
          set({ loginState: RequestState.FAIL })
          throw err
        }
      },
      accessToken: undefined,
      refreshToken: undefined,
      idToken: undefined,
      user: undefined,
      pathBeforeLogin: undefined,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Auth Store", useAuthStore)
}
