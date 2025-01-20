"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Formik } from "formik";
import * as Yup from "yup";
import { auth, db } from "@/firebase";

// Validation schema for form inputs
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login({ role }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle login process
  const handleLogin = async (values, { setSubmitting }) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === role) {
          await updateProfile(user, { displayName: userData.role });
          router.push("/dashboard"); // Redirect to a dashboard or appropriate page
        } else {
          alert("Role mismatch. Please log in with the correct role.");
          await auth.signOut();
        }
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 bg-white p-6 rounded shadow"
          >
            <div className="text-center">
              <h1 className="text-xl font-bold">Login</h1>
              {role && <p className="text-gray-500">Role: {role}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            >
              Back
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}
