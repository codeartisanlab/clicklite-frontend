'use client';

import { apiRequest } from '@/app/lib/api';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Notification = {
    id: string;
    kind: string;
    message: string;
    link: string;
    is_read: boolean;
    created_at: string;
};

const kindLabel: Record<string, string> = {
    task: 'New task',
    comment: 'Comment',
    due: 'Due',
};

export default function Notifications() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadNotifications() {
            try {
                const data = await apiRequest('/api/notifications');
                setNotifications(data);
            } catch (error) {
                console.error('Notification loading error:', error);
            } finally {
                setLoading(false);
            }
        }

        loadNotifications();
    }, []);

    useEffect(() => {
        function onReceived(event: Event) {
            const notification = (event as CustomEvent<Notification>).detail;

            setNotifications((current) => [notification, ...current]);
        }

        window.addEventListener('notification-received', onReceived);

        return () => {
            window.removeEventListener('notification-received', onReceived);
        };
    }, []);

    async function openNotification(notification: Notification) {
        try {
            if (!notification.is_read) {
                const updated = await apiRequest(
                    `/api/notifications/${notification.id}/read`,
                    { method: 'POST' }
                );

                setNotifications((current) =>
                    current.map((item) =>
                        item.id === notification.id ? updated : item
                    )
                );

                window.dispatchEvent(new Event('notifications-changed'));
            }

            router.push(notification.link);
        } catch (error) {
            console.error('Notification open error:', error);
        }
    }

    async function markAllRead() {
        try {
            await apiRequest('/api/notifications/read-all', {
                method: 'POST',
            });

            setNotifications((current) =>
                current.map((item) => ({
                    ...item,
                    is_read: true,
                }))
            );

            window.dispatchEvent(new Event('notifications-changed'));
        } catch (error) {
            console.error('Mark all read error:', error);
        }
    }

    return (
        <div>
            <Header />
            <main className='flex'>
                <Sidebar />
                <div className='flex flex-1 flex-col gap-4 p-5'>
                    <div className='flex justify-between w-full items-center'>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>
                            Notifications
                        </h2>
                        <button
                            type='button'
                            onClick={markAllRead}
                            className='text-white py-1 px-3 bg-black rounded-lg'
                        >
                            Mark all read
                        </button>
                    </div>

                    <div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
                        <table className='w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-3 font-semibold text-gray-900'>Kind</th>
                                    <th className='px-6 py-3 font-semibold text-gray-900'>Message</th>
                                    <th className='px-6 py-3 font-semibold text-gray-900'>Time</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {loading && (
                                    <tr>
                                        <td className='px-6 py-4' colSpan={3}>
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {!loading && notifications.length === 0 && (
                                    <tr>
                                        <td className='px-6 py-4' colSpan={3}>
                                            No notifications yet.
                                        </td>
                                    </tr>
                                )}

                                {notifications.map((notification) => (
                                    <tr
                                        key={notification.id}
                                        onClick={() => openNotification(notification)}
                                        className='hover:bg-gray-50 cursor-pointer'
                                    >
                                        <td className={`px-6 py-4 ${notification.is_read ? 'text-gray-400' : 'font-medium text-gray-900'}`}>
                                            {kindLabel[notification.kind] || notification.kind}
                                        </td>
                                        <td className={`px-6 py-4 ${notification.is_read ? 'text-gray-400' : 'font-medium text-gray-900'}`}>
                                            {notification.message}
                                        </td>
                                        <td className={`px-6 py-4 ${notification.is_read ? 'text-gray-400' : 'font-medium text-gray-900'}`}>
                                            {new Date(notification.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}