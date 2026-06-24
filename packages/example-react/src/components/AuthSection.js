import { useSelector } from "react-redux";
import { executeQueries } from "firedux-storage";

const AuthSection = () => {
  const user = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.status);

  const handleGoogleSignIn = () =>
    executeQueries([{ queryType: "signInGoogle" }]);

  const handleSignOut = () =>
    executeQueries([{ queryType: "signOut" }]);

  return (
    <div className="auth-section">
      {user ? (
        <div className="auth-user">
          <span>Signed in as <strong>{user.email}</strong></span>
          <button onClick={handleSignOut} disabled={authStatus === "loading"}>
            Sign out
          </button>
        </div>
      ) : (
        <div className="auth-guest">
          <span>Not signed in</span>
          <button onClick={handleGoogleSignIn} disabled={authStatus === "loading"}>
            {authStatus === "loading" ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthSection;
