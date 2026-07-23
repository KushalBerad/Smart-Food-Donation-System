import { Eye, EyeOff } from "lucide-react";

import {
    BG_ERROR,
    BORDER,
    BORDER_ERROR,
    ICON_MUTED,
    INPUT_BG,
    TEXT_DARK,
    TEXT_MUTED,
} from "../../utils/constants";

function PasswordInput({
    Icon,
    placeholder,
    value,
    onChange,
    hasError,
    showPassword,
    onToggle,
}) {
    return (
        <div
            className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
            style={{
                background: hasError ? BG_ERROR : INPUT_BG,
                border: `1px solid ${hasError ? BORDER_ERROR : BORDER}`,
            }}
        >
            <Icon
                size={16}
                color={ICON_MUTED}
                className="shrink-0"
            />

            <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm"
                style={{ color: TEXT_DARK }}
            />

            <button
                type="button"
                onClick={onToggle}
                className="flex bg-transparent border-0 p-0 cursor-pointer"
                aria-label="Toggle password visibility"
                style={{ color: TEXT_MUTED }}
            >
                {showPassword ? (
                    <EyeOff size={16} />
                ) : (
                    <Eye size={16} />
                )}
            </button>
        </div>
    );
}

export default PasswordInput;