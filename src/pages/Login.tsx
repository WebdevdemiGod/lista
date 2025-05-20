import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import AuthInput from "@/components/AuthInput";
import { Button } from "@/components/ui/button";

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
      const response = await fetch(
        `https://todo-list.dcism.org/signin_action.php?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = await response.json();

      if (data.status === 200 && data.data) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/todos");
      } else {
        setError(data.message || "Invalid email or password");
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
