import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Http } from "@capacitor-community/http";

import Logo from "@/components/Logo";
import AuthInput from "@/components/AuthInput";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
    };

    try {
      const response = await fetch(
        "https://todo-list.dcism.org/signup_action.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        navigate("/login");
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-white">
      <Logo />
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-4 mt-8">
        <AuthInput
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={setFirstName}
          onClear={() => setFirstName("")}
        />
        <AuthInput
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={setLastName}
          onClear={() => setLastName("")}
        />
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
        <AuthInput
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onClear={() => setConfirmPassword("")}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7E69AB] hover:bg-[#6a5991] text-white py-3 rounded-lg"
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/login")}
          className="w-full border-[#7E69AB] text-[#7E69AB] py-3 rounded-lg"
        >
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default Signup;
