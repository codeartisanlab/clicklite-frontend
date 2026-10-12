'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';

type Task = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    project_id: string;
};

function todayString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
}

function isTaskDue(task: Task) {
    if (!task.due_date || task.status === 'done') {
        return false;
    }

    return task.due_date <= todayString();
}

export default function TaskList() {
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.id as string;
    const dueOnly = searchParams.get('due') === '1';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [dueDate, setDueDate] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTasks() {
            try {
                const endpoint = dueOnly
                    ? `/api/projects/${projectId}/tasks?due=true`
                    : `/api/projects/${projectId}/tasks`;
                const data = await apiRequest(endpoint);
                setTasks(data);
            } catch (error) {
                console.error('Task loading error:', error);
            } finally {
                setLoading(false);
            }
        }

        if (projectId) {
            loadTasks();
        }
    }, [projectId, dueOnly]);

    async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim()) {
            setError('Title is required.');
            return;
        }

        try {
            setCreating(true);
            setError('');

            const task = await apiRequest(
                `/api/projects/${projectId}/tasks`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: title.trim(),
                        description: description.trim() || null,
                        status,
                        due_date: dueDate || null,
                    }),
                }
            );

            if (!dueOnly || isTaskDue(task)) {
                setTasks((current) => [task, ...current]);
            }

            setTitle('');
            setDescription('');
            setStatus('todo');
            setDueDate('');
            setIsModalOpen(false);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to create task.'
            );
        } finally {
            setCreating(false);
        }
    }

    return (
        <div>
            <Header />
            <main className='flex'>
                <Sidebar />
                <div className='flex flex-1 flex-col gap-4 p-5'>

                    <div className='flex justify-between w-full items-center'>
                        <div>
                            <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>
                                {dueOnly ? 'Tasks Due' : 'Tasks'}
                            </h2>
                        </div>
                        <div className='flex gap-3 items-center'>
                            <div>
                                <Link href={`/projects/${projectId}/kanban`} className='bg-green-700 text-white p-3 rounded-lg cursor-pointer'>Kanban Board</Link>
                            </div>
                            <div>
                                <button onClick={() => setIsModalOpen(true)} type='button' className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>Create Task</button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Title</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-6 text-center">
                                            Loading tasks...
                                        </td>
                                    </tr>
                                ) : tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-6 text-center text-gray-500">
                                            {dueOnly ? 'No tasks due.' : 'No tasks found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <Link href={`/projects/${projectId}/tasks/${task.id}`}>
                                                    {task.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                {task.status}
                                            </td>
                                            <td className="px-6 py-4">
                                                {task.due_date || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>

            {isModalOpen &&
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
                    <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                        <form onSubmit={handleCreateTask} className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Title</label>
                                <input
                                    type='text'
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Detail</label>
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                ></textarea>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Status</label>
                                <select
                                    value={status}
                                    onChange={(event) => setStatus(event.target.value)}
                                    className='p-2 bg-gray-100 rounded-xl w-1/2'
                                >
                                    <option value='todo'>To do</option>
                                    <option value='in_progress'>In progress</option>
                                    <option value='done'>Done</option>
                                </select>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Due Date</label>
                                <input
                                    type='date'
                                    value={dueDate}
                                    onChange={(event) => setDueDate(event.target.value)}
                                    className='p-2 bg-gray-100 rounded-xl w-1/2'
                                />
                            </div>
                            {error && (
                                <p className='text-sm text-red-600'>{error}</p>
                            )}
                            <div className='flex justify-end gap-2'>
                                <button type='button' onClick={() => setIsModalOpen(false)} className='text-black py-1 px-3 bg-gray-300 rounded-lg'>Cancel</button>
                                <button type='submit' disabled={creating} className='text-white py-1 px-3 bg-black rounded-lg'>
                                    {creating ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }

        </div>
    )
}