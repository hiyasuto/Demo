"use client";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/authConfig";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { instance, accounts } = useMsal();
  const router = useRouter();

  useEffect(() => {
    if (accounts.length > 0) {
      router.push("/dashboard");
    }
  }, [accounts, router]);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Azure Sales Negotiation Log
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customer interaction tracking for Azure Sales Team
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
            </svg>
            <span>Sign in with Microsoft</span>
          </button>
          
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Sign in with your Microsoft Entra ID account
          </p>
        </div>
      </div>
    </div>
  );
}
