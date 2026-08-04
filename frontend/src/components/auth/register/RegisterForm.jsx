import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthAlert from "../AuthAlert";
import AuthButton from "../AuthButton";
import AuthFooter from "../AuthFooter";
import AuthHeader from "../AuthHeader";
import AuthInput from "../AuthInput";
import PasswordInput from "../PasswordInput";
import RoleSwitch from "../RoleSwitch";

import { registerUser } from "../../../services/authService";

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
    TEXT_ERROR,
    TEXT_LABEL,
    TEXT_MUTED,
} from "../../../utils/constants";

import {
    validateRegisterForm,
} from "../../../utils/validators";

export default function RegisterForm() {
    const navigate = useNavigate();
    const [role, setRole] = useState("donor");
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] =
        useState("");
    const [submitted, setSubmitted] =
        useState(false);
    const [fileName, setFileName] =
        useState("");
    const [showPassword, setShowPassword] =
        useState({});
    const config = FIELD_CONFIG[role];
    const gradientStyle = {
        backgroundImage:
            `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`,
    };
    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
        if (serverError) {
            setServerError("");
        }
    };
    const handleFileChange = (name, file) => {
        setFileName(
            file ? file.name : ""
        );
        handleChange(
            name,
            file ? file.name : ""
        );
    };
    const togglePassword = (name) => {
        setShowPassword((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };
    const switchRole = (newRole) => {
        setRole(newRole);
        setFormData({});
        setErrors({});
        setFileName("");
        setSubmitted(false);
        setServerError("");
    };
    const buildPayload = (
        currentRole,
        currentFormData
    ) => {
        if (currentRole === "donor") {
            return {
                name:
                    currentFormData.fullName,
                email:
                    currentFormData.email
                        .trim()
                        .toLowerCase(),
                password:
                    currentFormData.password,
                phone:
                    currentFormData.phone.trim(),
                role: "donor",
                city:
                    currentFormData.city?.trim(),
                address:
                    currentFormData.address?.trim(),
                organizationName:
                    currentFormData.orgName?.trim() ||
                    "",
                registrationNumber: "",
                verificationDocument: "",
            };
        }
        return {
            name:
                currentFormData.contactPerson ||
                currentFormData.ngoName,
            email:
                currentFormData.email
                    .trim()
                    .toLowerCase(),
            password:
                currentFormData.password,
            phone:
                currentFormData.phone.trim(),
            role: "ngo",
            city:
                currentFormData.city?.trim(),
            address:
                currentFormData.address?.trim(),
            organizationName:
                currentFormData.ngoName?.trim() ||
                "",
            registrationNumber:
                currentFormData.regNumber || "",
            verificationDocument:
                currentFormData.verificationDoc || "",
        };
    };
    const handleSubmit = async () => {
        const newErrors =
            validateRegisterForm(
                config,
                formData
            );
        setErrors(newErrors);
        if (
            Object.keys(newErrors).length > 0
        ) {
            return;
        }
        try {
            setLoading(true);
            setServerError("");
            const payload =
                buildPayload(
                    role,
                    formData
                );
            const response =
                await registerUser(
                    payload
                );
            if (!response.success) {
                throw new Error(
                    response.message ||
                    "Registration failed"
                );
            }
            localStorage.setItem(
                "token",
                response.token
            );
            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data
                )
            );
            if (
                response.data.role === "ngo"
            ) {
                navigate(
                    "/ngo/dashboard",
                    {
                        replace: true,
                    }
                );
            } else {
                navigate(
                    "/dashboard",
                    {
                        replace: true,
                    }
                );
            }
        } catch (error) {
            setServerError(
                error.response?.data
                    ?.message ||
                error.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };
    if (submitted) {
        return (
            <div className="py-12">
                <AuthAlert
                    type="success"
                    message="Account created successfully."
                />
                <div className="mt-8 flex justify-center">
                    <CheckCircle2
                        size={72}
                        className="text-green-600"
                    />
                </div>
                <h2
                    className="
                        mt-6
                        text-center
                        text-3xl
                        font-bold
                    "
                >
                    Registration Successful
                </h2>
                <p
                    className="
                        mt-3
                        text-center
                        text-gray-500
                    "
                >
                    Your {role} account has been created.
                </p>
                <div className="mt-8">
                    <AuthButton
                        style={gradientStyle}
                        onClick={() =>
                            switchRole(role)
                        }
                    >
                        Register Another Account
                    </AuthButton>
                </div>
            </div>
        );
    }
    return (
        <>
            <AuthHeader
                title={config.title}
                subtitle={config.subtitle}
            />
            <RoleSwitch
                role={role}
                onChange={switchRole}
            />
            <AuthAlert
                type="error"
                message={serverError}
            />
            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-x-6
                    gap-y-6
                    mt-8
                "
            >
                {config.fields.map((field) => {
                    const Icon =
                        field.icon;
                    const isPassword =
                        field.type === "password";
                    const isFile =
                        field.type === "file";
                    const hasError =
                        !!errors[field.name];
                    return (
                        <div
                            key={field.name}
                            className={
                                field.span === 2
                                    ? "md:col-span-2"
                                    : ""
                            }
                        >
                            <label
                                className="
                                    block
                                    mb-2
                                    text-sm
                                    font-semibold
                                "
                                style={{
                                    color: TEXT_LABEL,
                                }}
                            >
                                {field.label}
                                {field.required && (
                                    <span
                                        style={{
                                            color: GREEN,
                                        }}
                                    >
                                        {" "}*
                                    </span>
                                )}
                            </label>
                            {isFile ? (
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        h-12
                                        px-4
                                        rounded-xl
                                        border
                                        border-dashed
                                        bg-white
                                    "
                                    style={{
                                        background:
                                            hasError
                                                ? BG_ERROR
                                                : INPUT_BG,
                                        border: `1px dashed ${hasError
                                            ? BORDER_ERROR
                                            : BORDER
                                            }`,
                                    }}
                                >
                                    <Icon
                                        size={18}
                                        color={ICON_MUTED}
                                    />
                                    <span
                                        className="
                                            flex-1
                                            truncate
                                            text-sm
                                        "
                                        style={{
                                            color: TEXT_MUTED,
                                        }}
                                    >
                                        {fileName ||
                                            field.placeholder}
                                    </span>
                                    <label
                                        className="
                                            px-3
                                            py-1.5
                                            rounded-lg
                                            text-sm
                                            font-medium
                                            cursor-pointer
                                            transition-all
                                            hover:scale-[1.02]
                                        "
                                        style={{
                                            background:
                                                GREEN_LIGHT,
                                            color:
                                                GREEN_DARK,
                                        }}
                                    >
                                        Choose File
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    field.name,
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                            ) : isPassword ? (
                                <PasswordInput
                                    Icon={Icon}
                                    placeholder={
                                        field.placeholder
                                    }
                                    value={
                                        formData[field.name] ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            field.name,
                                            e.target.value
                                        )
                                    }
                                    hasError={hasError}
                                    showPassword={
                                        showPassword[
                                        field.name
                                        ]
                                    }
                                    onToggle={() =>
                                        togglePassword(
                                            field.name
                                        )
                                    }
                                />
                            ) : (
                                <AuthInput
                                    Icon={Icon}
                                    type={
                                        field.type ||
                                        "text"
                                    }
                                    placeholder={
                                        field.placeholder
                                    }
                                    value={
                                        formData[field.name] ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            field.name,
                                            e.target.value
                                        )
                                    }
                                    hasError={hasError}
                                />
                            )}
                            {field.type === "file" && (
                                <p
                                    className="
                                        mt-2
                                        text-xs
                                    "
                                    style={{
                                        color:
                                            TEXT_MUTED,
                                    }}
                                >
                                    Accepted:
                                    PDF • JPG • PNG
                                    (Max 5MB)
                                </p>
                            )}
                            {hasError && (
                                <p
                                    className="
                                        mt-2
                                        text-xs
                                    "
                                    style={{
                                        color:
                                            TEXT_ERROR,
                                    }}
                                >
                                    {
                                        errors[
                                        field.name
                                        ]
                                    }
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
            {config.note && (
                <div
                    className="
                        mt-8
                        rounded-2xl
                        border
                        px-5
                        py-4
                    "
                    style={{
                        background:
                            GREEN_LIGHT,
                        border: `1px solid ${NOTE_BORDER}`,
                        color: NOTE_TEXT,
                    }}
                >
                    <p className="text-sm leading-7">
                        <strong>Note:</strong>{" "}
                        {config.note}
                    </p>
                </div>
            )}
            <div className="mt-10">
                <AuthButton
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={gradientStyle}
                >
                    {loading
                        ? "Creating account..."
                        : "Create Account"}
                </AuthButton>
            </div>
            <AuthFooter
                question="Already have an account?"
                linkText="Login"
                linkTo="/auth/login"
            />
        </>
    );
}