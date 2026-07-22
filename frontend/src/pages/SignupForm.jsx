import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Building2, User, Phone, Mail, Lock, MapPin, FileText, Upload, CheckCircle2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Color tokens — single source of truth, reused everywhere below.
// ---------------------------------------------------------------------------
const GREEN = "#1f9d55";
const GREEN_DARK = "#188046";
const GREEN_LIGHT = "#e8f7ee";
const BORDER = "#dfe5e1";
const BORDER_ERROR = "#e39a9a";
const BG_ERROR = "#fef6f6";
const NOTE_BORDER = "#c9ebd6";
const NOTE_TEXT = "#3a5c47";
const TEXT_MUTED = "#6b7a72";
const TEXT_DARK = "#16241c";
const TEXT_LABEL = "#2b3a32";
const TEXT_ERROR = "#d34b4b";
const ICON_MUTED = "#7a8a80";
const INPUT_BG = "#fafcfb";
const TAB_BG = "#f0f3f1";
const PAGE_BG = "#f4f7f5";

// ---------------------------------------------------------------------------
// Field config drives BOTH roles from one definition — this is the
// "common / role-based" part: one form engine, two field sets.
// ---------------------------------------------------------------------------
const FIELD_CONFIG = {
  donor: {
    title: "Donor Registration",
    subtitle: "Create your donor account",
    fields: [
      { name: "fullName", label: "Full Name", placeholder: "Enter your full name", icon: User, required: true, span: 1 },
      { name: "phone", label: "Phone Number", placeholder: "Enter 10 digit mobile number", icon: Phone, required: true, span: 1, type: "tel" },
      { name: "email", label: "Email Address", placeholder: "Enter your email address", icon: Mail, required: true, span: 2, type: "email" },
      { name: "password", label: "Password", placeholder: "Enter password", icon: Lock, required: true, span: 1, type: "password" },
      { name: "confirmPassword", label: "Confirm Password", placeholder: "Confirm password", icon: Lock, required: true, span: 1, type: "password" },
      { name: "city", label: "City", placeholder: "Enter your city", icon: MapPin, required: true, span: 1 },
      { name: "orgName", label: "Organization Name (Optional)", placeholder: "e.g. Your Organization / Restaurant / Group", icon: Building2, required: false, span: 1 },
    ],
    note: "Organization name is optional. Individuals can register without it.",
  },
  ngo: {
    title: "NGO Registration",
    subtitle: "Create your NGO account",
    fields: [
      { name: "ngoName", label: "NGO Name", placeholder: "Enter NGO name", icon: Building2, required: true, span: 1 },
      { name: "regNumber", label: "Registration Number", placeholder: "Enter registration number", icon: FileText, required: true, span: 1 },
      { name: "contactPerson", label: "Contact Person", placeholder: "Enter contact person name", icon: User, required: true, span: 1 },
      { name: "phone", label: "Phone Number", placeholder: "Enter 10 digit mobile number", icon: Phone, required: true, span: 1, type: "tel" },
      { name: "email", label: "Email Address", placeholder: "Enter your email address", icon: Mail, required: true, span: 2, type: "email" },
      { name: "password", label: "Password", placeholder: "Enter password", icon: Lock, required: true, span: 1, type: "password" },
      { name: "confirmPassword", label: "Confirm Password", placeholder: "Confirm password", icon: Lock, required: true, span: 1, type: "password" },
      { name: "city", label: "City", placeholder: "Enter your city", icon: MapPin, required: true, span: 1 },
      { name: "verificationDoc", label: "Verification Document", placeholder: "Upload registration certificate / NGO document", icon: Upload, required: true, span: 2, type: "file" },
    ],
    note: null,
  },
};

export default function SignupForm() {
  const [role, setRole] = useState("donor");
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const config = FIELD_CONFIG[role];

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

  const validate = () => {
    const newErrors = {};
    config.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label.replace(" (Optional)", "")} is required`;
      }
    });
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10 digit mobile number";
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
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
      <div className="min-h-screen w-full flex justify-center px-4 py-8" style={{ background: PAGE_BG }}>
        <div
          className="w-full max-w-[530px] bg-white rounded-2xl shadow-sm px-7 py-8"
          style={{ border: `1px solid ${BORDER}` }}
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
        </div>
      </div>
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
            aria-label="Back"
            className="flex items-center gap-1.5 text-sm bg-transparent border-0 p-0 cursor-pointer"
            style={{ color: TEXT_MUTED }}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <a href="#" className="text-sm font-semibold no-underline" style={{ color: GREEN }}>
            Login
          </a>
        </div>

        <div className="flex items-center gap-2.5 mb-5">
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
                  <div
                    className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
                    style={{
                      background: hasError ? BG_ERROR : INPUT_BG,
                      border: `1px solid ${hasError ? BORDER_ERROR : BORDER}`,
                    }}
                  >
                    <Icon size={16} color={ICON_MUTED} className="shrink-0" />
                    <input
                      type={inputType}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm"
                      style={{ color: TEXT_DARK }}
                    />
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => togglePassword(field.name)}
                        aria-label="Toggle password visibility"
                        className="flex bg-transparent border-0 p-0 cursor-pointer"
                        style={{ color: TEXT_MUTED }}
                      >
                        {showPassword[field.name] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                )}

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
            style={{ color: NOTE_TEXT, background: GREEN_LIGHT, border: `1px solid ${NOTE_BORDER}` }}
          >
            <strong>Note:</strong> {config.note}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-[10px] text-white text-[15px] font-bold mt-1 cursor-pointer"
          style={gradientStyle}
        >
          Create Account
        </button>

        <div className="text-center text-[13px] mt-4" style={{ color: TEXT_MUTED }}>
          Already have an account?{" "}
          <a href="#" className="font-semibold no-underline" style={{ color: GREEN }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
