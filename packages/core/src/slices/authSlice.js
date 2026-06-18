import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

const serializeUser = (user) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

export const signInWithEmailThunk = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return serializeUser(result.user);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUpWithEmailThunk = createAsyncThunk(
  "auth/signUpWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return serializeUser(result.user);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGoogleThunk = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      return serializeUser(result.user);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithFacebookThunk = createAsyncThunk(
  "auth/signInWithFacebook",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, new FacebookAuthProvider());
      return serializeUser(result.user);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutThunk = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      await signOut(auth);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const signInCases = [signInWithEmailThunk, signUpWithEmailThunk, signInWithGoogleThunk, signInWithFacebookThunk];

    signInCases.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.user = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        });
    });

    builder
      .addCase(signOutThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.error = null;
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(resetPasswordThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
