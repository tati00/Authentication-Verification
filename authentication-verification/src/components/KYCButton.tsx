import { useAuth } from "../context/AuthContext";

export default function KYCButton() {
  const { user, startKYC } = useAuth();

  return (
    <button 
      onClick={startKYC}
      disabled={user?.kycStatus === "pending"}
    >
      {user?.kycStatus === "pending" ? "Verify in progress..." : "Init KYC"}
    </button>
  );
}