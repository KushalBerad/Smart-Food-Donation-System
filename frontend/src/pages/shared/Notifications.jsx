import {
    Bell,
    CheckCheck,
    CheckCircle,
    Clock,
    Trash2,
    XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
    deleteNotification,
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../../services/notificationService";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await getNotifications();

            setNotifications(response.data || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);

            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);


    const markAsRead = async (id) => {
        try {
            const notification = notifications.find(
                (item) => item._id === id
            );

            if (notification?.isRead) return;

            await markNotificationAsRead(id);

            setNotifications((prev) =>
                prev.map((item) =>
                    item._id === id
                        ? { ...item, isRead: true }
                        : item
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    isRead: true,
                }))
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const previous = notifications;

            setNotifications((prev) =>
                prev.filter((item) => item._id !== id)
            );

            try {
                await deleteNotification(id);
            } catch (error) {
                console.error(error);
                setNotifications(previous);
            }

            setNotifications((prev) =>
                prev.filter((item) => item._id !== id)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type = "") => {
        switch (type.toLowerCase()) {
            case "accepted":
                return <CheckCircle className="text-green-600" size={22} />;

            case "rejected":
                return <XCircle className="text-red-500" size={22} />;

            case "request":
                return <Bell className="text-amber-500" size={22} />;

            case "profile":
                return <Bell className="text-blue-500" size={22} />;

            default:
                return <Clock className="text-sky-500" size={22} />;
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Clock
                        size={28}
                        className="animate-pulse text-[#16A34A]"
                    />
                    <p className="text-sm text-gray-500">
                        Loading notifications...
                    </p>
                </div>
            </div>
        );
    }

    const formatDate = (date) =>
        new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });

    return (
        <div className="flex-1 p-6 bg-gray-50 min-h-screen space-y-6">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Notifications
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Stay updated with your donation activity.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 bg-[#16A34A] text-white px-4 py-2 rounded-xl 
                    hover:bg-[#15803D]
                    font-semibold
                    transition"
                >
                    <CheckCheck size={18} />
                    Mark all as read
                </button>

            </div>

            <div className="space-y-4">

                {notifications.length === 0 ? (

                    <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm border">
                        No notifications available.
                    </div>

                ) : (

                    notifications.map((item) => (

                        <div
                            key={item._id}
                            onClick={() => markAsRead(item._id)}
                            className={`bg-white rounded-2xl shadow-sm border p-5 flex 
                                justify-between items-start cursor-pointer 
                                transition hover:shadow-md hover:border-[#16A34A] ${!item.isRead
                                    ? "border-[#16A34A]"
                                    : "border-gray-100"
                                }`}
                        >

                            <div className="flex gap-4">

                                {getIcon(item.type)}

                                <div>

                                    <h3 className="font-semibold text-gray-900">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {item.message}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-2">
                                        {formatDate(item.createdAt)}
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">
                                {!item.isRead && (
                                    <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
                                )}

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item._id);
                                    }}
                                    className="text-red-500
                                                transition
                                                hover:scale-110
                                                hover:text-red-700"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}