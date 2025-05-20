import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";

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
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  // Check if running on mobile and log network status
  useEffect(() => {
    const platform = Capacitor.getPlatform();
    setShowDebug(platform !== "web");

    if (platform !== "web") {
      addDebugLog(`App started on ${platform} platform`);

      // Check and log network status
      Network.getStatus()
        .then((status) => {
          const connection = status.connected ? "online" : "offline";
          addDebugLog(`Network status: ${connection}, type: ${status.connectionType}`);
        })
        .catch((err) => {
          addDebugLog(`Failed to get network status: ${err.message}`);
        });
    }
  }, []);

  // Helper function to add timestamped logs
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    addDebugLog(`Login attempt - Email: ${email}`);
    addDebugLog(`Password length: ${password.length} chars`);

    try {
      let response;
      const platform = Capacitor.getPlatform();
      addDebugLog(`Detected platform: ${platform}`);

      if (platform === "web") {
        // Use Axios in web
        addDebugLog("Using web API method with Axios");
        try {
          response = await authApi.signIn({ email, password });
          addDebugLog("Web API call completed");
        } catch (webErr) {
          addDebugLog(`Web API error: ${JSON.stringify(webErr)}`);
          throw webErr;
        }
      } else {
        // Use standard fetch API for mobile
        addDebugLog("Using standard fetch API for mobile");
        addDebugLog("Preparing request to: https://todo-list.dcism.org/signin_action.php");

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        addDebugLog(`Request payload: email=${email}, password=*****`);

        try {
          addDebugLog("Sending fetch POST request...");

          const fetchResponse = await fetch("https://todo-list.dcism.org/signin_action.php", {
            method: "POST",
            body: formData,
          });

          addDebugLog(`Response status: ${fetchResponse.status}`);

          const responseData = await fetchResponse.json();
          addDebugLog(`Response data: ${JSON.stringify(responseData)}`);

          response = {
            status: fetchResponse.status,
            data: responseData,
            message: responseData?.message || "",
          };
        } catch (fetchErr: any) {
          addDebugLog(`Fetch error: ${fetchErr.toString()}`);
          addDebugLog("First approach failed, trying with URLSearchParams...");

          try {
            const params = new URLSearchParams();
            params.append("email", email);
            params.append("password", password);

            const fetchResponse2 = await fetch("https://todo-list.dcism.org/signin_action.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: params,
            });

            addDebugLog(`Second attempt status: ${fetchResponse2.status}`);

            const responseData2 = await fetchResponse2.json();
            addDebugLog(`Second attempt data: ${JSON.stringify(responseData2)}`);

            response = {
              status: fetchResponse2.status,
              data: responseData2,
              message: responseData2?.message || "",
            };
          } catch (fetchErr2: any) {
            addDebugLog(`Second fetch approach also failed: ${fetchErr2.toString()}`);
            throw fetchErr2;
          }
        }
      }

      addDebugLog(`Processing response - Status: ${response?.status}`);

      if (response?.status === 200 && response.data) {
        addDebugLog("Login successful");
        try {
          localStorage.setItem("user", JSON.stringify(response));
          addDebugLog("User data saved to localStorage");
          addDebugLog("Navigating to /todos");
          navigate("/todos");
        } catch (storageErr: any) {
          addDebugLog(`localStorage error: ${storageErr.message}`);
        }
      } else {
        const errorMsg = response?.message || "Invalid email or password";
        addDebugLog(`Login failed: ${errorMsg}`);
        setError(errorMsg);
      }
    } catch (err: any) {
      addDebugLog(`Caught exception in handleLogin`);
      if (err.message) {
        addDebugLog(`Error message: ${err.message}`);
      }
      if (err.name) {
        addDebugLog(`Error type: ${err.name}`);
      }
      console.error("Login error:", JSON.stringify(err));
      setError("Network error. Please try again.");
    } finally {
      addDebugLog("Login process completed");
      setLoading(false);
    }
  };

  // Clear debug logs
  const clearLogs = () => {
    setDebugLogs([]);
    addDebugLog("Logs cleared");
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

      {/* Debug panel - only visible on mobile */}
      {showDebug && (
        <div className="w-full max-w-md mt-8 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
          <div className="bg-gray-200 p-2 flex justify-between items-center">
            <h3 className="font-bold text-sm">Debug Logs</h3>
            <button
              onClick={clearLogs}
              className="text-xs bg-gray-300 px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
          <div className="p-2 max-h-60 overflow-auto">
            {debugLogs.length === 0 ? (
              <p className="text-gray-500 text-xs italic">No logs yet</p>
            ) : (
              <pre className="text-xs whitespace-pre-wrap break-all font-mono">
                {debugLogs.join("\n")}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
