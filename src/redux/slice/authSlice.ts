import { loginUser, registerUser } from "@/actions/auth"
import { User } from "@/types/user"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"


interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  lastFetch: number | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  lastFetch: null,
}

export const fetchUser = createAsyncThunk<User | null, void>(
  "auth/fetchUser",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState }
    const now = Date.now()
    if (state.auth.lastFetch && now - state.auth.lastFetch < 5 * 60 * 1000) {
      return null
    }

    try {
      const res = await fetch("/api/user", { credentials: "include" })
      if (!res.ok) return rejectWithValue("Unauthorized")
      const data = await res.json()

      return data.user as User
    } catch {
      return rejectWithValue("Failed to fetch user")
    }
  }
)

export const register = createAsyncThunk<
  any,
  { email: string; password: string; confirmPassword: string }
>(
  "auth/register",
  async ({ email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const data = await registerUser(email, password, confirmPassword)
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const login = createAsyncThunk<
  any,
  { email: string; password: string }
>(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const data = await loginUser(email, password)
      // After login success, fetch user details
      await dispatch(fetchUser())
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerAndLogin = createAsyncThunk<
  any,
  { email: string; password: string , confirmPassword: string}
>(
  "auth/register",
  async ({ email, password, confirmPassword }, { dispatch, rejectWithValue }) => {
    try {
      const data = await registerUser(email, password , confirmPassword)
      // After login success, fetch user details
      await dispatch(fetchUser())
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const logout = createAsyncThunk<void, void>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Logout failed")
    } catch (e) {
      return rejectWithValue("Logout failed")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null
      state.error = null
      state.loading = false
      state.lastFetch = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.user = action.payload
          state.lastFetch = Date.now()
          state.error = null
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.error = action.payload as string
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.error = null
        state.lastFetch = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAuth } = authSlice.actions
export default authSlice.reducer
