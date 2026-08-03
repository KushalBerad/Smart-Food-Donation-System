import {
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Mail,
    Phone,
} from "lucide-react";
import { useState } from "react";
import {
    createSupportTicket,
} from "../../services/supportService";
const faqs = [
    {
        question: "How do I donate food?",
        answer:
            "Go to Create Donation, fill in the food details and submit the donation.",
    },
    {
        question: "How can an NGO request food?",
        answer:
            "Browse available donations and click Request Donation.",
    },
    {
        question: "Can I edit a donation?",
        answer:
            "You can edit a donation only before it has been accepted by an NGO.",
    },
    {
        question: "How is food verified?",
        answer:
            "Donors provide food preparation and pickup details. NGOs verify food quality before collection.",
    },
    {
        question: "Who delivers the food?",
        answer:
            "Pickup is coordinated between the donor and the NGO.",
    },
    {
        question: "How do I contact support?",
        answer:
            "Use the contact form below or email support@foodrescue.com.",
    },
];

export default function HelpSupport() {
    const [openFAQ, setOpenFAQ] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await createSupportTicket({
                subject: form.subject.trim(),
                message: form.message.trim(),
            });

            alert("Support ticket submitted successfully.");

            setForm({
                subject: "",
                message: "",
            });

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to submit support ticket."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">

            {/* Header */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Help & Support
                </h1>

                <p className="mt-2 text-gray-500">
                    Need help? Contact our support team or browse frequently asked
                    questions.
                </p>
            </div>

            {/* Contact Section */}

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Contact Form */}

                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Contact Support
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                        />

                        <textarea
                            rows="5"
                            name="message"
                            placeholder="Describe your issue..."
                            value={form.message}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#16A34A] hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-50"
                        >
                            {loading ? "Submitting..." : "Submit Ticket"}
                        </button>

                    </form>

                </div>

                {/* Support Information */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Support Information
                    </h2>

                    <div className="space-y-6">

                        <div className="flex gap-3">

                            <Mail className="text-green-600 mt-1" />

                            <div>
                                <p className="font-medium">Email</p>
                                <p className="text-gray-500 text-sm">
                                    support@foodrescue.com
                                </p>
                            </div>

                        </div>

                        <div className="flex gap-3">

                            <Phone className="text-green-600 mt-1" />

                            <div>
                                <p className="font-medium">Phone</p>
                                <p className="text-gray-500 text-sm">
                                    +91 98765 43210
                                </p>
                            </div>

                        </div>

                        <div className="flex gap-3">

                            <Clock className="text-green-600 mt-1" />

                            <div>
                                <p className="font-medium">
                                    Working Hours
                                </p>

                                <p className="text-gray-500 text-sm">
                                    Monday – Saturday
                                </p>

                                <p className="text-gray-500 text-sm">
                                    9:00 AM – 6:00 PM
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-3">

                            <AlertCircle className="text-green-600 mt-1" />

                            <div>

                                <p className="font-medium">
                                    Emergency Contact
                                </p>

                                <p className="text-gray-500 text-sm">
                                    1800-123-4567
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* FAQ */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <h2 className="text-xl font-semibold mb-5">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-3">

                    {faqs.map((faq, index) => (

                        <div
                            key={index}
                            className="border rounded-xl"
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setOpenFAQ(
                                        openFAQ === index ? null : index
                                    )
                                }
                                className="w-full flex justify-between items-center px-5 py-4 text-left font-medium"
                            >

                                {faq.question}

                                {openFAQ === index ? (
                                    <ChevronUp size={18} />
                                ) : (
                                    <ChevronDown size={18} />
                                )}

                            </button>

                            {openFAQ === index && (

                                <div className="px-5 pb-4 text-gray-600">
                                    {faq.answer}
                                </div>

                            )}

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}