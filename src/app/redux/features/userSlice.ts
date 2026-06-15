import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

/* =========================
   TYPES
========================= */

type LoginResponse = {
  message: boolean;
  authToken: string;
};

type LoginPayload = {
  email: string;
  password: string;
};


type signupResponse = {
  name:string;
  message: boolean;
  authToken: string;
};

type signupPayload = {
  name:string;
  email: string;
  password: string;
};


type FetchUserResponse = {
  success: boolean;
  message: string;
  user: {
    _id: string
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
};

type userResponse = {
  installed: boolean
  message: string;
  name: string;
};

interface UserState {
  userid:string;
  name: string;
  email: string;
  isInstall: boolean;
  isLogin: boolean;
  loading: boolean;
  error: string | null;
}

/* =========================
   LOGIN
========================= */

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>(
  "user/loginUser",
  async (
    { email, password },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data: LoginResponse =
        await response.json();

      if (!response.ok) {
        return rejectWithValue(
          "Invalid credentials"
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    }
  }
);



/* =========================
   Register User
========================= */

export const signup = createAsyncThunk<
  signupResponse,
  signupPayload,
  { rejectValue: string }
>(
  "user/signup",
  async (
    { name, email, password },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/registerUser",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data: signupResponse =
        await response.json();

      if (!response.ok) {
        return rejectWithValue(
          "Invalid credentials"
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    }
  }
);



/* =========================
   Register User
========================= */

export const logout = createAsyncThunk<
  void, // Return type
  void, // Argument type
  { rejectValue: string } // Thunk API config
>(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          "Logout failed"
        );
      }
      return;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Logout failed"
      );
    }
  }
);


/* =========================
   INSTALL STATUS
========================= */

export const fetchInstallStatus =
  createAsyncThunk<
    userResponse,
    void ,
    { rejectValue: string } 
  >(
    "user/fetchInstallStatus",
    async () => {
      const response = await fetch(
        "http://localhost:3000/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );
      return response.json();
    }
  );

/* =========================
   CHECK TOKEN
========================= */

export const fetchUser =
  createAsyncThunk<
    FetchUserResponse,
    void,
    { rejectValue: string }
  >(
    "user/fetchUser",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/fetchUser",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        const data: FetchUserResponse =
          await response.json();

        if (!response.ok) {
          return rejectWithValue(
            "Invalid token"
          );
        }

        return data;
      } catch {
        return rejectWithValue(
          "Something went wrong"
        );
      }
    }
  );

/* =========================
   STATE
========================= */

const initialState: UserState = {
  userid:"",
  name: "",
  email: "",
  isInstall: true,
  isLogin: true,
  loading: false,
  error: null,
};

/* =========================
   SLICE
========================= */

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLogin: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isLogin =
        action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // CHECK TOKEN
      .addCase(
        fetchUser.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchUser.fulfilled,
        (state, action) => {
          state.loading = false;
          state.isLogin = true;
          state.email = action.payload.user.email
          state.userid = action.payload.user._id
          state.name = action.payload.user.name
        }
      )
      .addCase(
        fetchUser.rejected,
        (state, action) => {
          console.log("check 3")
          state.loading = false;
          state.isLogin = false;
          state.name = "";
          state.error =
            action.payload ??
            "Something went wrong";
        }
      )

      // INSTALL STATUS
      .addCase(
        fetchInstallStatus.fulfilled,
        (state, action) => {
          state.isInstall =
            action.payload.installed;
          state.name =
            action.payload.name;
        }
      )

      // LOGIN
      .addCase(
        loginUser.fulfilled,
        (state) => {
          state.isLogin = true;
          state.error = null;
        }
      )
      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.isLogin = false;
          state.error =
            action.payload ??
            "Login failed";
        }
      )
      
      // signup
      .addCase(
        signup.fulfilled,
        (state) => {
          state.isInstall = true;
          state.error = null;
        }
      )
      .addCase(
        signup.rejected,
        (state, action) => {
          state.isLogin = false;
          state.isInstall= false;
          state.error =
            action.payload ??
            "signup failed";
        }
      )

      // signup
      .addCase(
        logout.fulfilled,
        (state) => {
          state.isLogin = false;
          state.error = null;
        }
      );
  },
});

export const {
  setIsLogin,
} = userSlice.actions;

export default userSlice.reducer;