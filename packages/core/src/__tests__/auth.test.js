import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDispatch = vi.fn();
vi.mock("../store/store.js", () => ({
  getStore: vi.fn(() => ({ dispatch: mockDispatch })),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  FacebookAuthProvider: vi.fn(),
}));

import {
  signInEmail,
  signUpEmail,
  signInGoogle,
  signInFacebook,
  signOutUser,
  resetPassword,
} from "../actions/auth.js";

const mockUser = { uid: "u1", email: "test@example.com", displayName: "Test", photoURL: null, emailVerified: false };

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockResolvedValue({ payload: mockUser });
  });

  it("signInEmail dispatches a thunk and returns the payload", async () => {
    const result = await signInEmail({ email: "test@example.com", password: "pass" });
    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(result).toEqual(mockUser);
  });

  it("signUpEmail dispatches a thunk and returns the payload", async () => {
    const result = await signUpEmail({ email: "new@example.com", password: "pass" });
    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(result).toEqual(mockUser);
  });

  it("signInGoogle dispatches a thunk and returns the payload", async () => {
    const result = await signInGoogle();
    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(result).toEqual(mockUser);
  });

  it("signInFacebook dispatches a thunk and returns the payload", async () => {
    const result = await signInFacebook();
    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(result).toEqual(mockUser);
  });

  it("signOutUser dispatches a thunk and returns true", async () => {
    mockDispatch.mockResolvedValue({ payload: true });
    const result = await signOutUser();
    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });

  it("resetPassword dispatches a thunk and returns true", async () => {
    mockDispatch.mockResolvedValue({ payload: true });
    const result = await resetPassword({ email: "test@example.com" });
    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });
});
