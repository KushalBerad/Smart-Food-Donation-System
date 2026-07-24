import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";
import { loginUser } from "../../services/authService";

const GREEN = "#1f9d55";
const GREEN_DARK = "#188046";
const GREEN_LIGHT = "#e8f7ee";
const BORDER = "#dfe5e1";
const BORDER_ERROR = "#e39a9a";
const BG_ERROR = "#fef6f6";
const TEXT_MUTED = "#6b7a72";
const TEXT_DARK = "#16241c";
const TEXT_LABEL = "#2b3a32";
const TEXT_ERROR = "#d34b4b";
const ICON_MUTED = "#7a8a80";
const INPUT_BG = "#fafcfb";
const PAGE_BG = "#f4f7f5";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email Address is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      // Store auth session
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect to donor dashboard
      navigate("/dashboard");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const gradientStyle = { backgroundImage: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})` };

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-8" style={{ background: PAGE_BG }}>
      <div
        className="w-full max-w-[450px] bg-white rounded-2xl shadow-sm px-7 pt-6 pb-8 h-fit my-auto"
        style={{ border: `1px solid ${BORDER}` }}
      >
        {/* Header link */}
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/auth/register"
            className="flex items-center gap-1.5 text-sm bg-transparent border-0 p-0 cursor-pointer no-underline"
            style={{ color: TEXT_MUTED }}
          >
            <ArrowLeft size={18} />
            <span>Register</span>
          </Link>
          <Link to="/auth/register" className="text-sm font-semibold no-underline" style={{ color: GREEN }}>
            Sign up
          </Link>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={gradientStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M12 2c-1.5 3-2 5-2 7a2 2 0 104 0c0-2-.5-4-2-7z" />
              <path d="M6 13c0 4 2.5 8 6 8s6-4 6-8" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-[15px]" style={{ color: TEXT_DARK }}>FoodRescue</div>
            <div className="text-xs" style={{ color: TEXT_MUTED }}>Share Food, Help People</div>
          </div>
        </div>

        <h1 className="text-center text-[22px] font-bold mt-1 mb-0.5" style={{ color: TEXT_DARK }}>
          Welcome back
        </h1>
        <p className="text-center text-[13px] mb-6" style={{ color: TEXT_MUTED }}>
          Login to access your dashboard
        </p>

        {serverError && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-100 px-3 py-2 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: TEXT_LABEL }}>
              Email Address <span style={{ color: GREEN }}>*</span>
            </label>
            <div
              className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
              style={{
                background: errors.email ? BG_ERROR : INPUT_BG,
                border: `1px solid ${errors.email ? BORDER_ERROR : BORDER}`,
              }}
            >
              <Mail size={16} color={ICON_MUTED} className="shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm"
                style={{ color: TEXT_DARK }}
              />
            </div>
            {errors.email && <div className="text-xs" style={{ color: TEXT_ERROR }}>{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[13px] font-semibold" style={{ color: TEXT_LABEL }}>
                Password <span style={{ color: GREEN }}>*</span>
              </label>
              <Link to="/auth/forgot-password" className="text-xs no-underline" style={{ color: GREEN }}>
                Forgot?
              </Link>
            </div>
            <div
              className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
              style={{
                background: errors.password ? BG_ERROR : INPUT_BG,
                border: `1px solid ${errors.password ? BORDER_ERROR : BORDER}`,
              }}
            >
              <Lock size={16} color={ICON_MUTED} className="shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm"
                style={{ color: TEXT_DARK }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="flex bg-transparent border-0 p-0 cursor-pointer"
                style={{ color: TEXT_MUTED }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div className="text-xs" style={{ color: TEXT_ERROR }}>{errors.password}</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-[10px] text-white text-[15px] font-bold mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={gradientStyle}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center text-[13px] mt-5" style={{ color: TEXT_MUTED }}>
          Don't have an account?{" "}
          <Link to="/auth/register" className="font-semibold no-underline" style={{ color: GREEN }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
