"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const checkAuth = useCallback(
    async (isRetry = false) => {
      try {
        setError(null);

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Connection timeout")), 10000);
        });

        const authPromise = supabase.auth.getSession();

        const {
          data: { session },
          error: authError,
        } = (await Promise.race([authPromise, timeoutPromise])) as any;

        if (authError) {
          throw authError;
        }

        if (session) {
          setAuthenticated(true);
          setRetryCount(0);
        } else {
          router.push("/sign-in");
        }
      } catch (error: any) {
        console.error("Auth check error:", error);

        if (
          error.message === "Connection closed." ||
          error.message === "Connection timeout"
        ) {
          setError("Connection lost. Please check your internet connection.");

          // Retry logic for connection issues
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1);
              checkAuth(true);
            }, 2000 * (retryCount + 1)); // Exponential backoff
            return;
          }
        } else {
          setError("Authentication failed. Please try again.");
        }

        if (!isRetry) {
          router.push("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    },
    [router, retryCount],
  );

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push("/sign-in");
      } else if (event === "SIGNED_IN" && session) {
        setAuthenticated(true);
        setError(null);
        setRetryCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAuth, router]);

  const handleRetry = () => {
    setLoading(true);
    setRetryCount(0);
    checkAuth();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {retryCount > 0 ? `Retrying... (${retryCount}/3)` : "Loading..."}
          </p>
          {retryCount > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Attempting to reconnect...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error && !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto text-center p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connection Error
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect to sign-in
  }

  return <>{children}</>;
}
