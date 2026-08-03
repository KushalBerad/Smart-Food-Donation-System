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
            const response = await getNotifications();
            setNotifications(response.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);


    const markAsRead = async (id) => {
        try {
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
            await deleteNotification(id);

            setNotifications((prev) =>
                prev.filter((item) => item._id !== id)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "accepted":
                return (
                    <CheckCircle className="text-green-600" size={22} />
                );

            case "rejected":
                return (
                    <XCircle className="text-red-500" size={22} />
                );

            case "request":
                return (
                    <Bell className="text-amber-500" size={22} />
                );

            default:
                return (
                    <Clock className="text-sky-500" size={22} />
                );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading notifications...
            </div>
        );
    }

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
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 bg-[#16A34A] text-white px-4 py-2 rounded-xl hover:bg-green-700"
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
                                transition hover:shadow-md ${!item.isRead
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
                                        {new Date(item.createdAt).toLocaleString()}
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">
                                {!item.isRead && (
                                    <span className="w-3 h-3 rounded-full bg-[#16A34A]" />
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item._id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
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