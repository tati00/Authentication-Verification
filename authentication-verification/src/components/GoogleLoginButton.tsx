import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import "../styles/GoogleLoginButton.css";

export default function GoogleLoginButton() {
  const { user, login, logout } = useAuth();
  type GoogleAuthErrorCodes =
    | "popup_closed_by_user"
    | "access_denied"
    | "idpiframe_initialization_failed";

  const getUserFriendlyError = (error: {
    code?: string;
    message?: string;
  }): string => {
    const errorMap: Record<GoogleAuthErrorCodes | "default", string> = {
      popup_closed_by_user: "You closed the login window",
      access_denied: "Login was denied",
      idpiframe_initialization_failed:
        "Browser blocked Google login. Try disabling ad blockers",
      default: "Login failed. Please try again later",
    };

    return error.code && isGoogleAuthErrorCode(error.code)
      ? errorMap[error.code]
      : errorMap.default;
  };

  // Verify error codes from type
  function isGoogleAuthErrorCode(code: string): code is GoogleAuthErrorCodes {
    return [
      "popup_closed_by_user",
      "access_denied",
      "idpiframe_initialization_failed",
    ].includes(code);
  }
  const handleGoogleLoginError = (error: {
    code?: string;
    message?: string;
  }) => {
    console.error("Google Login Error:", {
      errorDetails: error,
      errorCode: error.code || "no_error_code",
      errorMessage: error.message || "No detailed error message",
      time: new Date().toISOString(),
    });

    alert(getUserFriendlyError(error));
  };

  return (
    <div>
      {!user ? (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              login(credentialResponse.credential);
            }
          }}
          onError={() => {
            handleGoogleLoginError;
          }}
        />
      ) : (
        <div>
          <p>Welcome, {user.name}!</p>
          <div className="relative">
            <div className="absolute flex justify-start ">
              <button className="mt-4 sm:mt-6 px-6 py-3 text-white font-medium rounded-md kycButton">
                KYCButton
              </button>
            </div>
            <div className="flex justify-end ">
              <button
                className="mt-4 sm:mt-6 px-6 py-3 text-black font-medium rounded-md logoutButton"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
