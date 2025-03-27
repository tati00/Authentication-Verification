import "./App.css";
import backgroundImage from './assets/fondo-login.png';
import GoogleLoginButton from "./components/GoogleLoginButton";

function App() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black">
      <img
        src={backgroundImage} 
        alt="Circular neural network background"
        className="min-h-full max-w-full object-cover animate-pulse-scale animate-spin-slow"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white  rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full">
        <h1 className="text-2lg font-bold mb-4">Authenticacion-Verification</h1>
        <br />
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default App;
