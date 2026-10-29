'use client';

import React, { useEffect, useState } from 'react'
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';

type SearchProject = {
    id: string;
    name: string;
    workspace_name: string;
};

type SearchTask = {
    id: string;
    title: string;
    project_id: string;
    project_name: string;
};

type SearchResults = {
    projects: SearchProject[];
    tasks: SearchTask[];
};

function HeaderSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const term = query.trim();

        if (!term) {
            return;
        }

        let ignore = false;

        const timer = setTimeout(async () => {
            try {
                setSearching(true);
                const data = await apiRequest(
                    `/api/search?q=${encodeURIComponent(term)}`
                );
                if (!ignore) {
                    setResults(data);
                }
            } catch (error) {
                console.error('Search error:', error);
                if (!ignore) {
                    setResults({ projects: [], tasks: [] });
                }
            } finally {
                if (!ignore) {
                    setSearching(false);
                }
            }
        }, 300);

        return () => {
            ignore = true;
            clearTimeout(timer);
        };
    }, [query]);

    function closeSearch() {
        setQuery('');
        setResults(null);
        setSearching(false);
    }

    function handleQueryChange(value: string) {
        setQuery(value);

        if (!value.trim()) {
            setResults(null);
            setSearching(false);
        }
    }

    const showResults = query.trim().length > 0;

    return (
        <div className='relative'>
            <input
                type='text'
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder='search'
                className='bg-gray-100 border w-lg border-gray-400 p-1 rounded-lg'
            />
            {showResults && (
                <div className='absolute left-0 top-full z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-80 overflow-y-auto'>
                    {searching && (
                        <p className='p-3 text-sm text-gray-500'>Searching...</p>
                    )}
                    {!searching && results && results.projects.length === 0 && results.tasks.length === 0 && (
                        <p className='p-3 text-sm text-gray-500'>No matches</p>
                    )}
                    {!searching && results && results.projects.length > 0 && (
                        <div className='p-2'>
                            <p className='px-2 py-1 text-xs text-gray-500'>Projects</p>
                            {results.projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    onClick={closeSearch}
                                    className='block px-2 py-2 rounded hover:bg-gray-100'
                                >
                                    <span className='block'>{project.name}</span>
                                    <span className='block text-xs text-gray-500'>{project.workspace_name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                    {!searching && results && results.tasks.length > 0 && (
                        <div className='p-2 border-t border-gray-100'>
                            <p className='px-2 py-1 text-xs text-gray-500'>Tasks</p>
                            {results.tasks.map((task) => (
                                <Link
                                    key={task.id}
                                    href={`/projects/${task.project_id}/tasks/${task.id}`}
                                    onClick={closeSearch}
                                    className='block px-2 py-2 rounded hover:bg-gray-100'
                                >
                                    <span className='block'>{task.title}</span>
                                    <span className='block text-xs text-gray-500'>{task.project_name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

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


    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            return;
        }

        const socket = new WebSocket(
            `${apiUrl.replace(/^http/, 'ws')}/api/notifications/ws`
        );

        socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);

            if (!notification.is_read) {
                setUnreadCount((count) => count + 1);
            }

            window.dispatchEvent(
                new CustomEvent('notification-received', {
                    detail: notification,
                })
            );
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <header className='flex items-center justify-between p-5 border-b border-gray-200 h-16'>
            <div className='w-64 flex items-center gap-3'>
                <div className='bg-black text-white rounded-xs w-8 h-8 justify-center flex items-center font-bold'>C</div>
                <div>
                    <h1 className='font-bold text-2xl'>ClickLite</h1>
                </div>
            </div>
            <HeaderSearch key={pathname} />
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
    );
}