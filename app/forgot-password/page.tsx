"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUCCESS SCREEN (FIXED RETURN)
  if (isSubmitted) {
    return (
      <div className="px-4 md:px-8 h-screen flex items-center justify-center">
        <div className="w-full max-w-lg bg-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2">Check your email</h2>

          <p className="text-gray-600">
            If an account exists for <b>{email}</b>, a reset link has been sent.
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Didn’t receive an email? Check spam or try again.
          </p>

          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full mt-5 py-3 bg-gray-200 rounded-lg"
          >
            Try again
          </button>

          <Link
            href="/login"
            className="block text-center mt-4 text-primary"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 px-4 md:px-8">
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-lg">
          <h1 className="text-center font-bold text-3xl">Monvexa</h1>
          <p className="text-center mt-2">Your Money Clarity System</p>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-card mt-7 px-4 py-8 md:p-8 w-full"
          >
            <Link href="/login" className="flex items-center gap-x-3 mb-6">
              <FaArrowLeft className="text-gray-600" />
              <p className="text-sm text-gray-600">Back to login</p>
            </Link>

            <h2 className="font-bold text-2xl mb-3">Forgot password?</h2>

            <p className="text-gray-600">
              Enter your email and we’ll send you a reset link
            </p>

            {/* EMAIL */}
            <div className="mt-5">
              <label>Email</label>

              <div
                className={`flex items-center gap-x-3 border-2 rounded-2xl mt-2 p-3 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              >
                <HiOutlineMail className="text-gray-600 text-2xl" />

                <input
                  type="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full outline-none"
                  placeholder="name@example.com"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full py-3 rounded-xl bg-primary text-white"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}