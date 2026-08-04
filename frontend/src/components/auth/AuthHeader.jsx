import Logo from "./Logo";

import {
    GREEN,
    GREEN_DARK,
    TEXT_DARK,
    TEXT_MUTED,
} from "../../utils/constants";

function AuthHeader({
    title,
    subtitle,
}) {
    const gradientStyle = {
        backgroundImage: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`,
    };

    return (
        <header className="mb-8">

            {/* Logo */}

            <Logo
                title="FoodRescue"
                subtitle="Share Food, Help People"
                gradientStyle={gradientStyle}
                textDark={TEXT_DARK}
                textMuted={TEXT_MUTED}
            />

            {/* Heading */}

            <div className="mt-10">

                <h1
                    className="
                        text-4xl
                        lg:text-5xl
                        font-bold
                        tracking-tight
                        leading-tight
                    "
                    style={{
                        color: TEXT_DARK,
                    }}
                >
                    {title}
                </h1>

                {subtitle && (

                    <p
                        className="
                            mt-3
                            text-[15px]
                            leading-7
                            max-w-lg
                        "
                        style={{
                            color: TEXT_MUTED,
                        }}
                    >
                        {subtitle}
                    </p>

                )}

            </div>

        </header>
    );
}

export default AuthHeader;