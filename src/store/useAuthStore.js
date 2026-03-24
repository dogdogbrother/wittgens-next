import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      address: null,
      isLoggedIn: false,

      setAuth: ({ token, refreshToken, address }) => {
        set({
          token,
          refreshToken: refreshToken ?? get().refreshToken,
          address,
          isLoggedIn: true,
        })
      },

      logout: () => {
        set({ token: null, refreshToken: null, address: null, isLoggedIn: false })
      },
    }),
    {
      name: 'rwa-auth',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        address: state.address,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)
