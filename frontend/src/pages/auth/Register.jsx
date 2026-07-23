import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import Logo from "../../components/auth/Logo";
import PasswordInput from "../../components/auth/PasswordInput";
import {
  BG_ERROR,
  BORDER,
  BORDER_ERROR,
  FIELD_CONFIG,
  GREEN,
  GREEN_DARK,
  GREEN_LIGHT,
  ICON_MUTED,
  INPUT_BG,
  NOTE_BORDER,
  NOTE_TEXT,
  PAGE_BG,
  TAB_BG,
  TEXT_DARK,
  TEXT_ERROR,
  TEXT_LABEL,
  TEXT_MUTED,
} from "../../utils/constants";
import { validateRegisterForm } from "../../utils/validators";

export default function SignupForm() {
  const [role, setRole] = useState("donor");
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const config = FIELD_CONFIG[role];
  const navigate = useNavigate();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (name, file) => {
    setFileName(file ? file.name : "");
    handleChange(name, file ? file.name : "");
  };

  const togglePassword = (name) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = () => {
    const newErrors = validateRegisterForm(config, formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setFormData({});
    setErrors({});
    setFileName("");
    setSubmitted(false);
  };

  const gradientStyle = { backgroundImage: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})` };

  if (submitted) {
    return (
      <AuthLayout
        pageBg={PAGE_BG}
        border={BORDER}
      >
        <div className="flex flex-col items-center text-center gap-1.5 py-5">
          <CheckCircle2 size={56} color={GREEN} strokeWidth={1.5} />
          <h2 className="text-xl font-bold mt-2" style={{ color: TEXT_DARK }}>Account created</h2>
          <p className="text-sm mb-3" style={{ color: TEXT_MUTED }}>
            Your {role === "donor" ? "donor" : "NGO"} account is ready. You can log in now.
          </p>
          <button
            className="w-full py-3 rounded-lg text-white text-[15px] font-bold mt-1"
            style={gradientStyle}
            onClick={() => switchRole(role)}
          >
            Register another account
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-8" style={{ background: PAGE_BG }}>
      <div
        className="w-full max-w-[530px] bg-white rounded-2xl shadow-sm px-7 pt-6 pb-8"
        style={{ border: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            aria-label="Back"
            className="flex items-center gap-1.5 text-sm bg-transparent border-0 p-0 cursor-pointer"
            style={{ color: TEXT_MUTED }}
          >
            <ArrowLeft size={18} />
            <span>Back</span>

          </button>
          <Link
            to="/auth/login"
            className="text-sm font-semibold no-underline"
            style={{ color: GREEN }}
          >
            Login
          </Link>
        </div>

        <Logo
          title="FoodRescue"
          subtitle="Share Food, Help People"
          gradientStyle={gradientStyle}
          textDark={TEXT_DARK}
          textMuted={TEXT_MUTED}
        />

        {/* Role switch — this is the "role based" control */}
        <div className="flex rounded-[10px] p-1 mb-5" style={{ background: TAB_BG }}>
          {Object.keys(FIELD_CONFIG).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => switchRole(r)}
              className="flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer border-0"
              style={
                role === r
                  ? { background: "#ffffff", color: GREEN_DARK, boxShadow: "0 1px 2px rgba(16,24,20,0.08)" }
                  : { background: "transparent", color: TEXT_MUTED }
              }
            >
              {r === "donor" ? "Donor" : "NGO"}
            </button>
          ))}
        </div>

        <h1 className="text-center text-[22px] font-bold mt-1 mb-0.5" style={{ color: TEXT_DARK }}>
          {config.title}
        </h1>
        <p className="text-center text-[13px] mb-6" style={{ color: TEXT_MUTED }}>{config.subtitle}</p>

        {/* Form — rendered entirely from the shared field config */}
        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          {config.fields.map((field) => {
            const Icon = field.icon;
            const isPassword = field.type === "password";
            const isFile = field.type === "file";
            const inputType = isPassword && showPassword[field.name] ? "text" : field.type || "text";
            const hasError = !!errors[field.name];

            return (
              <div
                key={field.name}
                className={`flex flex-col gap-1.5 ${field.span === 2 ? "col-span-2" : "col-span-1"}`}
              >
                <label className="text-[13px] font-semibold" style={{ color: TEXT_LABEL }}>
                  {field.label}
                  {field.required && <span style={{ color: GREEN }}> *</span>}
                </label>

                {isFile ? (
                  <div
                    className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
                    style={{
                      background: hasError ? BG_ERROR : INPUT_BG,
                      border: `1px dashed ${hasError ? BORDER_ERROR : BORDER}`,
                    }}
                  >
                    <Icon size={16} color={ICON_MUTED} className="shrink-0" />
                    <span
                      className="flex-1 text-[13px] overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ color: TEXT_MUTED }}
                    >
                      {fileName || field.placeholder}
                    </span>
                    <label
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-md cursor-pointer whitespace-nowrap"
                      style={{ color: GREEN_DARK, background: GREEN_LIGHT }}
                    >
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(field.name, e.target.files[0])}
                      />
                    </label>

                  </div>
                ) : (
                  isPassword ? (
                    <PasswordInput
                      Icon={Icon}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                      hasError={hasError}
                      showPassword={showPassword[field.name]}
                      onToggle={() => togglePassword(field.name)}
                    />
                  ) : (
                    <AuthInput
                      Icon={Icon}
                      type={inputType}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                      hasError={hasError}
                    />
                  )
                )
                }

                {field.type === "file" && (
                  <div className="text-[11px]" style={{ color: TEXT_MUTED }}>PDF, JPG or PNG (Max. 5MB)</div>
                )}
                {hasError && (
                  <div className="text-xs" style={{ color: TEXT_ERROR }}>{errors[field.name]}</div>
                )}
              </div>
            );
          })}
        </div>

        {config.note && (
          <div
            className="text-[12.5px] leading-relaxed rounded-[10px] px-3 py-2.5 mb-4.5"
            style={{
              color: NOTE_TEXT,
              background: GREEN_LIGHT,
              border: `1px solid ${NOTE_BORDER}`,
            }}
          >
            <strong>Note:</strong> {config.note}
          </div>
        )}

        <AuthButton
          onClick={handleSubmit}
          style={gradientStyle}
        >
          Create Account
        </AuthButton>

        <div className="text-center text-[13px] mt-4" style={{ color: TEXT_MUTED }}>
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-semibold no-underline"
            style={{ color: GREEN }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
