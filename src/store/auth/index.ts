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
  expireDate: Date | undefined
  refreshToken: string | undefined
  idToken: string | undefined
  user: FetchUserInfoResponse | undefined
  pathBeforeLogin: string | undefined
  authState: RequestState
}
export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      authState: RequestState.IDLE,
      expireDate: undefined,
      loginRedirect: () => {
        set({ pathBeforeLogin: window.location.href, authState: RequestState.LOADING })
        window.location.assign(getAuthorizeEndpoint())
      },
      logout: async () => {
        const refreshToken = get().refreshToken
        if (!refreshToken) return
        try {
          set({ authState: RequestState.LOADING })
          await revokeTokens(refreshToken)
          set({
            authState: RequestState.SUCCESS,
            accessToken: undefined,
            refreshToken: undefined,
            idToken: undefined,
            user: undefined,
            expireDate: undefined,
          })
        } catch (err) {
          set({ authState: RequestState.FAIL })
        }
      },
      getToken: async (code: string) => {
        try {
          set({ authState: RequestState.LOADING })
          const { access_token, id_token, refresh_token, expires_in } = await fetchAccessToken(
            code,
            get().refreshToken,
          )
          set({
            authState: RequestState.SUCCESS,
            accessToken: access_token,
            idToken: id_token,
            refreshToken: refresh_token,
            expireDate: new Date(Date.now() * expires_in * 1000),
          })
          return access_token
        } catch (err) {
          set({ authState: RequestState.FAIL })
          throw err
        }
      },
      getUser: async () => {
        const accessToken = get().accessToken
        if (!accessToken) return
        try {
          set({ authState: RequestState.LOADING })
          const user = await fetchUserInfo(accessToken)
          set({
            authState: RequestState.SUCCESS,
            user,
          })
          return user
        } catch (err) {
          set({ authState: RequestState.FAIL })
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
