"use client";

import Link from "next/link";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // CLEAR FIELD ERROR
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // PASSWORD VALIDATION
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    // STOP IF THERE ARE ERRORS
    if (newErrors.email || newErrors.password) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            rememberMe
          }),
        }
      );

      let data;

      try {
        data = await res.json();
      } catch {
        data = { message: "Server error" };
      }

      // BACKEND ERROR
      if (!res.ok) {
        toast.error(data.message || "Login failed", {
          duration: 3000,
        });

        return;
      }

      // SUCCESS
      toast.success("Login successful", {
        duration: 2000,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong. Please try again.",
        {
          duration: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 px-4 md:px-8">
      <div className="flex items-center justify-center min-h-screen py-10">
        <div className="w-full max-w-lg">

          {/* LOGO */}
          <h1 className="text-center font-bold text-3xl">
            Monvexa
          </h1>

          <p className="text-center mt-2 text-gray-600">
            Your Money Clarity System
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-card mt-7 px-4 py-8 md:p-8 w-full border border-gray-200 shadow-sm"
          >
            <h2 className="font-bold text-2xl mb-6">
              Welcome back
            </h2>

            {/* EMAIL */}
            <div>
              <label>Email</label>

              <div
                className={`flex items-center gap-x-3 border-2 rounded-2xl mt-2 p-3 transition ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <HiOutlineMail className="text-gray-600 text-2xl" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full outline-none"
                  placeholder="name@example.com"
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mt-5">
              <label>Password</label>

              <div
                className={`flex items-center gap-x-3 border-2 p-3 rounded-2xl mt-2 transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <FiLock className="text-gray-600 text-2xl" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full outline-none"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="text-gray-500 text-xl cursor-pointer"
                >
                  {showPassword ? (
                    <VscEyeClosed />
                  ) : (
                    <VscEye />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* REMEMBER + FORGOT PASSWORD */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={ (e) => setRememberMe(e.target.checked)}
                />

                <label className="text-sm">
                  Remember me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="text-primary text-sm font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="mt-5">
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-4 mb-3 rounded-xl w-full text-white bg-primary cursor-pointer font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-center text-sm">
                Don't have an account?
                <Link
                  href="/signup"
                  className="text-primary pl-1 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>

          {/* TOASTER */}
          <Toaster
            position="top-right"
            richColors
          />
        </div>
      </div>
    </div>
  );
}