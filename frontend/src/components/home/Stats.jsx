const stats = [
    {
        value: "1200+",
        label: "Donations"
    },
    {
        value: "350+",
        label: "Verified NGOs"
    },
    {
        value: "18,000+",
        label: "Meals Served"
    },
    {
        value: "15",
        label: "Cities"
    },
];

export default function Stats() {
    return (

        <section className="py-20 bg-white">

            <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">

                {stats.map((item) => (

                    <div
                        key={item.label}
                        className="text-center bg-gray-50 rounded-2xl p-8"
                    >

                        <h2 className="text-4xl font-bold text-[#16A34A]">
                            {item.value}
                        </h2>

                        <p className="mt-3 text-gray-600">
                            {item.label}
                        </p>

                    </div>

                ))}

            </div>

        </section>

    );
}