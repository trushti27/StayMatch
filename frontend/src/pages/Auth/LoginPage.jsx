import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GraduationCap, Loader2, AlertCircle } from "lucide-react";
import authService from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();

  // Form starts empty
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await authService.login(formData);
      const userRole = response.data?.user?.role || response.user?.role;

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || "Login failed. Please check your email and password.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* StayMatch Branding & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to access your StayMatch account
          </p>
        </div>

        {/* Global Error Banner */}
        {errors.form && (
          <div className="mb-5 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-3.5 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">{errors.form}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 border rounded-lg outline-none text-sm transition
                ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                } disabled:bg-gray-50 disabled:text-gray-400`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 border rounded-lg outline-none text-sm transition
                ${
                  errors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-100"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                } disabled:bg-gray-50 disabled:text-gray-400`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                       disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Register Navigation */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
