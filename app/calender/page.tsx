'use client';

import { apiRequest } from '@/app/lib/api';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import Calendar from '@/components/utils/Calender';
import { useEffect, useState } from 'react';

type CalendarTask = {
    id: string;
    title: string;
    due_date: string;
    status: string;
    project_id: string;
    project_name: string;
};

export default function CalenderPage() {
    const [tasks, setTasks] = useState<CalendarTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = await apiRequest('/api/tasks');
                setTasks(data);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'Unable to load tasks.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, []);

    return (
        <div>
            <Header />
            <main className='flex'>
                <Sidebar />
                <div className='flex-1 p-4'>
                    <h2 className='text-2xl font-semibold mb-4'>Calendar</h2>
                    {error && (
                        <p className='mb-4 text-sm text-red-600'>{error}</p>
                    )}
                    {loading ? (
                        <p className='text-gray-600'>Loading tasks...</p>
                    ) : (
                        <Calendar tasks={tasks} />
                    )}
                </div>
            </main>
        </div>
    );
}