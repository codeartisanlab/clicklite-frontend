'use client';

import { apiRequest } from '@/app/lib/api';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type DayTask = {
    id: string;
    title: string;
    due_date: string | null;
    status: string;
    project_id: string;
    project_name: string;
};

type MyDay = {
    due: DayTask[];
    in_progress: DayTask[];
};

function TaskList({ tasks }: { tasks: DayTask[] }) {
    if (tasks.length === 0) {
        return <p className='text-gray-500'>None.</p>;
    }

    return (
        <ul className='flex flex-col gap-2'>
            {tasks.map((task) => (
                <li key={task.id}>
                    <Link
                        href={`/projects/${task.project_id}/tasks/${task.id}`}
                        className='block rounded-md border border-gray-200 px-3 py-2 hover:bg-gray-50'
                    >
                        <span className='font-medium text-gray-900'>{task.title}</span>
                        <span className='block text-sm text-gray-500'>
                            {task.project_name}
                            {task.due_date ? ` · ${task.due_date}` : ''}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export default function MyDayPage() {
    const [day, setDay] = useState<MyDay>({ due: [], in_progress: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [note, setNote] = useState('');
    const [planning, setPlanning] = useState(false);

    useEffect(() => {
        async function loadDay() {
            try {
                const data = await apiRequest('/api/tasks/my-day');
                setDay(data);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : 'Unable to load the day.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadDay();
    }, []);

    async function planDay() {
        if (day.due.length === 0 && day.in_progress.length === 0) {
            setError('Nothing is due or in progress.');
            return;
        }

        try {
            setPlanning(true);
            setError('');

            const data = await apiRequest('/api/ai/day', {
                method: 'POST',
            });

            setNote(data.note);
        } catch (planError) {
            setError(
                planError instanceof Error
                    ? planError.message
                    : 'Unable to plan the day.'
            );
        } finally {
            setPlanning(false);
        }
    }

    return (
        <div>
            <Header />
            <main className='flex'>
                <Sidebar />
                <div className='flex-1 p-4 max-w-3xl'>
                    <div className='mb-4 flex items-center justify-between gap-3'>
                        <h2 className='text-2xl font-semibold'>My day</h2>
                        <button
                            type='button'
                            onClick={planDay}
                            disabled={planning}
                            className='bg-black text-white p-2 rounded-lg disabled:opacity-50'
                        >
                            {planning ? 'Planning...' : 'Plan my day'}
                        </button>
                    </div>

                    {error && (
                        <p className='mb-4 text-sm text-red-600'>{error}</p>
                    )}
                    {note && (
                        <p className='mb-4 text-gray-800'>{note}</p>
                    )}

                    {loading ? (
                        <p className='text-gray-600'>Loading...</p>
                    ) : (
                        <div className='flex flex-col gap-6'>
                            <section>
                                <h3 className='mb-2 text-lg font-medium'>Due</h3>
                                <TaskList tasks={day.due} />
                            </section>
                            <section>
                                <h3 className='mb-2 text-lg font-medium'>In progress</h3>
                                <TaskList tasks={day.in_progress} />
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}