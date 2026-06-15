"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./style.css";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/redux/store";
import { loginUser } from "@/app/redux/features/userSlice";

import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";


type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function LoginPage() {

  const router = useRouter();
  const user = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
      if (user.isLogin){
        router.push("/dashboard")
      }
      if (user.isInstall == false){
        router.push("/signup")
      }
  }, [user]);

  const dispatch = useDispatch<AppDispatch>();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
        })
      ).unwrap();
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  return (
    <>
      {/* Inject CSS Variables */}
      <div className="page-bg flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md fade-in">

          {/* Brand Header */}
          <div className="text-center mb-8">
            {/* Geometric Logo Mark */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: "var(--primarycolor)" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="4" y="4" width="9" height="9" rx="2" fill="white" opacity="0.9"/>
                <rect x="15" y="4" width="9" height="9" rx="2" fill="white" opacity="0.45"/>
                <rect x="4" y="15" width="9" height="9" rx="2" fill="white" opacity="0.45"/>
                <rect x="15" y="15" width="9" height="9" rx="2"
                  style={{ fill: "var(--secondarycolor)" }} opacity="0.9"/>
              </svg>
            </div>
            <h1 className="brand-title text-3xl font-bold mb-1"
              style={{ color: "var(--primarycolor)" }}>
              AUX Dashboard<span className="accent-dot">.</span>
            </h1>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Card */}
          <div className="login-card card-shadow rounded-2xl p-8">

            {/* Success Banner */}
            {isSubmitSuccessful && (
              <div className="success-banner rounded-xl px-4 py-3 mb-6 flex items-center gap-2 text-sm font-medium">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="7" stroke="#22C55E" strokeWidth="1.5"/>
                  <path d="M5 8l2 2 4-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Welcome back! Redirecting…
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-1.5"
                  style={{ color: "var(--foreground)" }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`input-field w-full rounded-xl px-4 py-3 text-sm ${errors.email ? "error" : ""}`}
                  {...register("email", {
                    required: "Email address is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: "#ef4444" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5" stroke="#ef4444" strokeWidth="1.2"/>
                      <path d="M6 4v2.5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
                      <circle cx="6" cy="8.5" r="0.6" fill="#ef4444"/>
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Password
                  </label>
                  <a href="#" className="link-style text-xs">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`input-field w-full rounded-xl px-4 py-3 pr-11 text-sm ${errors.password ? "error" : ""}`}
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 8 characters.",
                      },
                      // pattern: {
                      //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      //   message: "Must include uppercase, lowercase, and a number.",
                      // },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="eye-btn absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
                          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
                          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium flex items-center gap-1" style={{ color: "#ef4444" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="5" stroke="#ef4444" strokeWidth="1.2"/>
                      <path d="M6 4v2.5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
                      <circle cx="6" cy="8.5" r="0.6" fill="#ef4444"/>
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="checkbox-custom rounded"
                  {...register("rememberMe")}
                />
                <label htmlFor="rememberMe" className="text-sm cursor-pointer select-none"
                  style={{ color: "#6b7280" }}>
                  Keep me signed in
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full rounded-xl py-3.5 text-sm flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                    </svg>
                    signupg in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <hr className="flex-1 divider-line"/>
              <span className="text-xs" style={{ color: "#9ca3af" }}>or</span>
              <hr className="flex-1 divider-line"/>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm" style={{ color: "#6b7280" }}>
              Don&apos;t have an account?{" "}
              <a href="#" className="link-style">
                Create one free
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
