'use client';

import React, { useEffect, useState } from 'react'
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';

export default function Header() {
    const pathname = usePathname();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        async function loadUnreadCount() {
            try {
                const data = await apiRequest('/api/notifications');
                const unread = data.filter(
                    (item: { is_read: boolean }) => !item.is_read
                ).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error('Notification count error:', error);
            }
        }

        loadUnreadCount();

        window.addEventListener('notifications-changed', loadUnreadCount);

        return () => {
            window.removeEventListener('notifications-changed', loadUnreadCount);
        };
    }, [pathname]);

    return (
        <header className='flex items-center justify-between p-5 border-b border-gray-200 h-16'>
            <div className='w-64 flex items-center gap-3'>
                <div className='bg-black text-white rounded-xs w-8 h-8 justify-center flex items-center font-bold'>C</div>
                <div>
                    <h1 className='font-bold text-2xl'>ClickLite</h1>
                </div>
            </div>
            <div>
                <input type='text' placeholder='search' className='bg-gray-100 border w-lg border-gray-400 p-1 rounded-lg' />
            </div>
            <div className='flex justify-end gap-5'>
                <div className='relative'>
                    <Link href={'/notifications'}><Bell /></Link>
                    {unreadCount > 0 && (
                        <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1'>
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div>
                    <Link href={'/auth/profile'}><Settings /></Link>
                </div>
            </div>
        </header>
    )
}