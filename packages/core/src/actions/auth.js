import {
  signInWithEmailThunk,
  signUpWithEmailThunk,
  signInWithGoogleThunk,
  signInWithFacebookThunk,
  signOutThunk,
  resetPasswordThunk,
} from "../slices/authSlice.js";
import { getStore } from "../store/store.js";

const dispatch = (thunk) => getStore().dispatch(thunk);

export const signInEmail = async ({ email, password }) => {
  const res = await dispatch(signInWithEmailThunk({ email, password }));
  return res.payload;
};

export const signUpEmail = async ({ email, password }) => {
  const res = await dispatch(signUpWithEmailThunk({ email, password }));
  return res.payload;
};

export const signInGoogle = async () => {
  const res = await dispatch(signInWithGoogleThunk());
  return res.payload;
};

export const signInFacebook = async () => {
  const res = await dispatch(signInWithFacebookThunk());
  return res.payload;
};

export const signOutUser = async () => {
  const res = await dispatch(signOutThunk());
  return res.payload;
};

export const resetPassword = async ({ email }) => {
  const res = await dispatch(resetPasswordThunk({ email }));
  return res.payload;
};
