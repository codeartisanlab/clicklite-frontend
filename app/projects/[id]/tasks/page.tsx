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
    priority: string;
    assignee: string | null;
    due_date: string | null;
    project_id: string;
    label:string|null
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

function priorityLabel(priority: string) {
    if (priority === 'high') {
        return 'High';
    }

    if (priority === 'low') {
        return 'Low';
    }

    return 'Medium';
}

function priorityClass(priority: string) {
    if (priority === 'high') {
        return 'text-red-600';
    }

    if (priority === 'low') {
        return 'text-green-700';
    }

    return 'text-orange-600';
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
    const [priority, setPriority] = useState('medium');
    const [assignee, setAssignee] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [label, setLabel] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [labelFilter, setLabelFilter] = useState('');
    const [assigneeFilter, setAssigneeFilter] = useState('');
    const [weekOnly, setWeekOnly] = useState(false);

useEffect(() => {
    async function loadTasks() {
        try {
            const params = new URLSearchParams();

            if (dueOnly) {
                params.set('due', 'true');
            }

            if (weekOnly) {
                params.set('week', 'true');
            }

            if (statusFilter) {
                params.set('status', statusFilter);
            }

            if (priorityFilter) {
                params.set('priority', priorityFilter);
            }

            if (labelFilter) {
                params.set('label', labelFilter);
            }

            if (assigneeFilter.trim()) {
                params.set('assignee', assigneeFilter.trim());
            }

            const query = params.toString();
            const endpoint = query
                ? `/api/projects/${projectId}/tasks?${query}`
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
}, [projectId, dueOnly, weekOnly, statusFilter, priorityFilter, labelFilter, assigneeFilter]);

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
                        priority,
                        assignee: assignee.trim() || null,
                        due_date: dueDate || null,
                        label: label || null,
                    }),
                }
            );

            if (!dueOnly || isTaskDue(task)) {
                setTasks((current) => [task, ...current]);
            }

            setTitle('');
            setLabel('');
            setDescription('');
            setStatus('todo');
            setPriority('medium');
            setAssignee('');
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


                    <div className='flex flex-wrap gap-3'>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className='p-2 bg-gray-100 rounded-xl'
                        >
                            <option value=''>All statuses</option>
                            <option value='todo'>To do</option>
                            <option value='in_progress'>In progress</option>
                            <option value='done'>Done</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(event) => setPriorityFilter(event.target.value)}
                            className='p-2 bg-gray-100 rounded-xl'
                        >
                            <option value=''>All priorities</option>
                            <option value='high'>High</option>
                            <option value='medium'>Medium</option>
                            <option value='low'>Low</option>
                        </select>
                        <select
                            value={labelFilter}
                            onChange={(event) => setLabelFilter(event.target.value)}
                            className='p-2 bg-gray-100 rounded-xl'
                        >
                            <option value=''>All labels</option>
                            <option value='bug'>Bug</option>
                            <option value='feature'>Feature</option>
                            <option value='design'>Design</option>
                        </select>
                        <input
                            type='text'
                            value={assigneeFilter}
                            onChange={(event) => setAssigneeFilter(event.target.value)}
                            placeholder='Assignee'
                            className='px-3 py-2 border border-gray-300 rounded-xl'
                        />
                        <label className='flex items-center gap-2 text-sm text-gray-700'>
                            <input
                                type='checkbox'
                                checked={weekOnly}
                                onChange={(event) => setWeekOnly(event.target.checked)}
                            />
                            Due this week
                        </label>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Title</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Priority</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Label</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-6 text-center">
                                            Loading tasks...
                                        </td>
                                    </tr>
                                ) : tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
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
                                            <td className={`px-6 py-4 font-medium ${priorityClass(task.priority)}`}>
                                                {priorityLabel(task.priority)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {task.label || '-'}
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
                                <label className='text-sm font-medium text-gray-700'>Priority</label>
                                <select
                                    value={priority}
                                    onChange={(event) => setPriority(event.target.value)}
                                    className='p-2 bg-gray-100 rounded-xl w-1/2'
                                >
                                    <option value='high'>High</option>
                                    <option value='medium'>Medium</option>
                                    <option value='low'>Low</option>
                                </select>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Label</label>
                                <select
                                    value={label}
                                    onChange={(event) => setLabel(event.target.value)}
                                    className='p-2 bg-gray-100 rounded-xl w-1/2'
                                >
                                    <option value=''>None</option>
                                    <option value='bug'>Bug</option>
                                    <option value='feature'>Feature</option>
                                    <option value='design'>Design</option>
                                </select>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Assignee</label>
                                <input
                                    type='text'
                                    value={assignee}
                                    onChange={(event) => setAssignee(event.target.value)}
                                    className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
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