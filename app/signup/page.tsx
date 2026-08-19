"use client";

import Link from "next/link";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    agreement: "",
  });

  const [serverError, setServerError] = useState("");

  // HANDLE INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // CLEAR FIELD ERROR
    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    // CLEAR SERVER ERROR
    setServerError("");
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      agreement: "",
    };

    // FULL NAME VALIDATION
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name is too short";
    }

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
      newErrors.password = "Password must be at least 8 characters";
    }

    // TERMS VALIDATION
    if (!agreed) {
      newErrors.agreement = "You must agree to the terms";
    }

    setErrors(newErrors);

    // STOP IF THERE ARE ERRORS
    if (
      newErrors.fullName ||
      newErrors.email ||
      newErrors.password ||
      newErrors.agreement
    ) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
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
        toast.error(data.message || "Signup failed", {
          duration: 3000,
        });

        return;
      }

      // SUCCESS
      toast.success("Account created successfully", {
        duration: 2000,
      });
      setSuccessMessage(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS POPUP
  if (successMessage) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center pt-10 px-4 pointer-events-none">
        <div className="w-full max-w-md h-1/2 backdrop-blur-xl bg-card/80 border border-white/30 shadow-2xl rounded-3xl p-6 pointer-events-auto animate-in slide-in-from-top duration-300">
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
              🎉
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome to Monvexa
          </h2>

          <p className="text-center text-gray-600 leading-relaxed mb-6">
            Your account has been created successfully. 
            You can now track expenses, monitor income,
            and gain complete clarity over your finances —
            all in one place.
          </p>

          <button
            onClick={() => {
              setSuccessMessage(false);
              router.push("/dashboard");
            }}
            className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
            className="rounded-xl bg-card mt-7 px-4 py-8 md:p-8 shadow-sm"
          >
            <h2 className="font-bold text-2xl mb-6">
              Create an account
            </h2>

            {/* FULL NAME */}
            <div>
              <label>Full Name</label>

              <div
                className={`flex items-center gap-x-3 border-2 p-3 rounded-2xl mt-2 transition ${
                  errors.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <FaRegUser className="text-gray-600 text-xl" />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full outline-none"
                  placeholder="John Doe"
                />
              </div>

              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="mt-4">
              <label>Email</label>

              <div
                className={`flex items-center gap-x-3 border-2 p-3 rounded-2xl mt-2 transition ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <HiOutlineMail className="text-gray-600 text-xl" />

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
            <div className="mt-4">
              <label>Password</label>

              <div
                className={`flex items-center gap-x-3 border-2 p-3 rounded-2xl mt-2 transition ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <FiLock className="text-gray-600 text-xl" />

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
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 text-xl cursor-pointer"
                >
                  {showPassword ? <VscEyeClosed /> : <VscEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* AGREEMENT */}
            <div className="flex items-start gap-x-2 mt-5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);

                  if (e.target.checked) {
                    setErrors({
                      ...errors,
                      agreement: "",
                    });
                  }
                }}
                className={`cursor-pointer mt-1 ${
                  errors.agreement
                    ? "accent-red-500"
                    : ""
                }`}
              />

              <label className="text-sm leading-relaxed">
                I agree to the{" "}
                <span className="text-primary font-medium">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-primary font-medium">
                  Privacy Policy
                </span>
              </label>
            </div>

            {errors.agreement && (
              <p className="text-red-500 text-sm mt-1">
                {errors.agreement}
              </p>
            )}


            {/* SUBMIT BUTTON */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-4 rounded-xl w-full text-white bg-primary font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create account"}
              </button>

              <p className="text-center mt-4 text-sm">
                Already have an account?
                <Link
                  href="/login"
                  className="pl-1 text-primary font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
          <Toaster position="bottom-right" richColors />
        </div>
      </div>
    </div>
  );
}