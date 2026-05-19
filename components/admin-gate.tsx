"use client";

import { useState, useEffect, ReactNode } from "react";
import { verifyAdminPassword } from "@/app/actions/auth";
import { Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AdminGateProps {
  children: ReactNode;
}

const SESSION_KEY = "admin-authenticated";

export function AdminGate({ children }: AdminGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated this session
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "true") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await verifyAdminPassword(password);

    if (result.success) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthenticated(true);
    } else {
      setError("Incorrect password");
      setPassword("");
    }
    setLoading(false);
  };

  // Still checking session
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full" />
      </div>
    );
  }

  // Not authenticated — show password gate
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-50 dark:bg-[#0a0a0b]">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock size={20} className="text-zinc-300" />
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Admin Access
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enter your password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full h-12 px-4 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={loading || !password}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-30"
              >
                {loading ? (
                  <div className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900 rounded-full" />
                ) : (
                  <ArrowRight size={14} />
                )}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  // Authenticated — render the protected content
  return <>{children}</>;
}
