export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AppState {
  firestore: {
    collection: Record<
      string,
      { docs: (Record<string, unknown> & { id: string })[] } | undefined
    >;
    document: Record<string, unknown> | null;
    status: "idle" | "loading" | "succeeded" | "failed";
  };
  auth: {
    user: AuthUser | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
  storage: {
    url: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
  };
}
