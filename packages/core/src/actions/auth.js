import {
  signInWithEmailThunk,
  signUpWithEmailThunk,
  signInWithGoogleThunk,
  signInWithFacebookThunk,
  signOutThunk,
  resetPasswordThunk,
} from "../slices/authSlice.js";
import { getStore } from "../store/store.js";

/**
 * @typedef {{ uid: string, email: string|null, displayName: string|null, photoURL: string|null, emailVerified: boolean }} AuthUser
 */

const dispatch = (thunk) => getStore().dispatch(thunk);

/**
 * Signs in with email and password.
 * @param {{ email: string, password: string }} params
 * @returns {Promise<AuthUser>}
 */
export const signInEmail = async ({ email, password }) => {
  const res = await dispatch(signInWithEmailThunk({ email, password }));
  return res.payload;
};

/**
 * Creates a new user with email and password.
 * @param {{ email: string, password: string }} params
 * @returns {Promise<AuthUser>}
 */
export const signUpEmail = async ({ email, password }) => {
  const res = await dispatch(signUpWithEmailThunk({ email, password }));
  return res.payload;
};

/**
 * Signs in with Google via popup.
 * @returns {Promise<AuthUser>}
 */
export const signInGoogle = async () => {
  const res = await dispatch(signInWithGoogleThunk());
  return res.payload;
};

/**
 * Signs in with Facebook via popup.
 * @returns {Promise<AuthUser>}
 */
export const signInFacebook = async () => {
  const res = await dispatch(signInWithFacebookThunk());
  return res.payload;
};

/**
 * Signs out the current user.
 * @returns {Promise<true>}
 */
export const signOutUser = async () => {
  const res = await dispatch(signOutThunk());
  return res.payload;
};

/**
 * Sends a password reset email.
 * @param {{ email: string }} params
 * @returns {Promise<true>}
 */
export const resetPassword = async ({ email }) => {
  const res = await dispatch(resetPasswordThunk({ email }));
  return res.payload;
};
