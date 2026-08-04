import {
    GREEN_DARK,
    TAB_BG,
    TEXT_MUTED,
} from "../../utils/constants";

function RoleSwitch({
    role,
    onChange,
}) {
    const roles = [
        {
            key: "donor",
            label: "Food Donor",
        },
        {
            key: "ngo",
            label: "NGO",
        },
    ];

    return (
        <div
            className="
                flex
                w-full
                rounded-2xl
                p-1
                mb-10
            "
            style={{
                background: TAB_BG,
            }}
        >
            {roles.map((item) => {

                const active =
                    role === item.key;

                return (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                            onChange(item.key)
                        }
                        className="
                            flex-1
                            h-12
                            rounded-xl
                            text-sm
                            font-semibold
                            transition-all
                            duration-200
                            cursor-pointer
                            border-0
                        "
                        style={
                            active
                                ? {
                                    background:
                                        "#FFFFFF",
                                    color:
                                        GREEN_DARK,
                                    boxShadow:
                                        "0 4px 12px rgba(15,23,42,.08)",
                                }
                                : {
                                    background:
                                        "transparent",
                                    color:
                                        TEXT_MUTED,
                                }
                        }
                    >
                        {item.label}
                    </button>
                );

            })}
        </div>
    );
}

export default RoleSwitch;