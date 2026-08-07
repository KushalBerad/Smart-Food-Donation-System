import heroImage from "../../assets/hero.png";

function HeroPanel() {
    return (
        <section
            className="
                relative
                hidden
                lg:flex
                h-screen
                overflow-hidden
            "
        >
            {/* Background Image */}
            <img
                src={heroImage}
                alt="Food Rescue"
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    scale-100
        opacity-0
                "
            />

            {/* Dark Overlay */}
            <div className="
            absolute 
            inset-0 
            bg-gradient-to-br 
            from-green-900/92 
            via-green-800/88 
            to-green-700/84
            " />

            {/* Content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    justify-between
                    h-full
                    w-full
                    px-16
                    py-16
                    text-white
                "
            >
                {/* Empty top spacing */}
                <div />

                {/* Hero Text */}
                <div className="max-w-xl">

                    <h1
                        className="
                            text-5xl
                            xl:text-6xl
                            font-bold
                            leading-tight
                            tracking-tight
                        "
                    >
                        Reduce
                        <br />
                        Food Waste.
                        <br />
                        Feed Lives.
                    </h1>

                    <p
                        className="
                            mt-6
                            text-lg
                            leading-8
                            text-green-50
                            max-w-lg
                        "
                    >
                        Connect restaurants, individuals and
                        organizations with verified NGOs to ensure
                        surplus food reaches people instead of
                        landfills.
                    </p>

                </div>

                {/* Statistics */}
                <div
                    className="
                        grid
                        grid-cols-3
                        gap-10
                        max-w-lg
                    "
                >

                    <div>
                        <h2 className="text-4xl font-bold">
                            500+
                        </h2>

                        <p className="mt-2 text-green-100 text-sm">
                            Meals Shared
                        </p>
                    </div>

                    <div>
                        <h2 className="text-4xl font-bold">
                            40+
                        </h2>

                        <p className="mt-2 text-green-100 text-sm">
                            Verified NGOs
                        </p>
                    </div>

                    <div>
                        <h2 className="text-4xl font-bold">
                            15+
                        </h2>

                        <p className="mt-2 text-green-100 text-sm">
                            Cities
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default HeroPanel;