import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import AuthInput from "@/components/AuthInput";
import { Button } from "@/components/ui/button";
import { authApi } from "@/api/backendApi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.signIn({ email, password });

      if (response.status === 200 && response.data) {
        // Remove sensitive info before storing

        // Store user data as JSON string in localStorage
        localStorage.setItem("user", JSON.stringify(response));

        navigate("/todos");
      } else {
        setError(response.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-white">
      <Logo />
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 mt-8">
        <AuthInput
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={setEmail}
          onClear={() => setEmail("")}
        />
        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          onClear={() => setPassword("")}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7E69AB] hover:bg-[#6a5991] text-white py-3 rounded-lg"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/signup")}
          className="w-full border-[#7E69AB] text-[#7E69AB] py-3 rounded-lg"
        >
          Sign up
        </Button>
      </form>
    </div>
  );
};

export default Login;
