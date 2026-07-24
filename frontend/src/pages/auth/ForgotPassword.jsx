import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

const GREEN = "#1f9d55";
const GREEN_DARK = "#188046";
const BORDER = "#dfe5e1";
const TEXT_MUTED = "#6b7a72";
const TEXT_DARK = "#16241c";
const TEXT_LABEL = "#2b3a32";
const ICON_MUTED = "#7a8a80";
const INPUT_BG = "#fafcfb";
const PAGE_BG = "#f4f7f5";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  const gradientStyle = { backgroundImage: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})` };

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-8" style={{ background: PAGE_BG }}>
      <div
        className="w-full max-w-[450px] bg-white rounded-2xl shadow-sm px-7 pt-6 pb-8 h-fit my-auto"
        style={{ border: `1px solid ${BORDER}` }}
      >
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/auth/login"
            className="flex items-center gap-1.5 text-sm bg-transparent border-0 p-0 cursor-pointer no-underline"
            style={{ color: TEXT_MUTED }}
          >
            <ArrowLeft size={18} />
            <span>Back to Login</span>
          </Link>
        </div>

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
          Reset Password
        </h1>
        <p className="text-center text-[13px] mb-6" style={{ color: TEXT_MUTED }}>
          {submitted ? "Check your email for reset instructions" : "Enter your email to receive reset instructions"}
        </p>

        {submitted ? (
          <div className="text-center text-sm py-4" style={{ color: GREEN_DARK }}>
            If an account exists for {email}, password reset instructions have been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold" style={{ color: TEXT_LABEL }}>
                Email Address <span style={{ color: GREEN }}>*</span>
              </label>
              <div
                className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
                style={{
                  background: INPUT_BG,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <Mail size={16} color={ICON_MUTED} className="shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm"
                  style={{ color: TEXT_DARK }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-[10px] text-white text-[15px] font-bold mt-2 cursor-pointer"
              style={gradientStyle}
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
