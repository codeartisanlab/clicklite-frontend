'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
};

type Comment = {
    id: string;
    body: string;
    task_id: string;
    author_name: string;
    created_at: string;
};

function statusLabel(status: string) {
    if (status === 'in_progress') {
        return 'In progress';
    }

    if (status === 'done') {
        return 'Done';
    }

    return 'To do';
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

function progressFor(status: string) {
    if (status === 'done') {
        return 100;
    }

    if (status === 'in_progress') {
        return 50;
    }

    return 0;
}

export default function TaskDetail() {
    const params = useParams();
    const router=useRouter;
    const projectId = params.id as string;
    const taskId = params.taskId as string;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentBody, setCommentBody] = useState('');
    const [commentError, setCommentError] = useState('');
    const [savingComment, setSavingComment] = useState(false);

    const progress = progressFor(task?.status ?? 'todo');

    useEffect(() => {
        async function loadTask() {
            try {
                const data = await apiRequest(
                    `/api/projects/${projectId}/tasks/${taskId}`
                );
                setTask(data);
            } catch (error) {
                console.error('Task detail loading error:', error);
            } finally {
                setLoading(false);
            }
        }

        async function loadComments() {
            try {
                const data = await apiRequest(
                    `/api/projects/${projectId}/tasks/${taskId}/comments`
                );
                setComments(data);
            } catch (error) {
                console.error('Comment loading error:', error);
            } finally {
                setCommentsLoading(false);
            }
        }

        if (projectId && taskId) {
            loadTask();
            loadComments();
        }
    }, [projectId, taskId]);

    async function saveTask(
        changes: Partial<Task>,
        successMessage: string,
    ) {
        if (!task) {
            return;
        }

        const previous = task;

        setTask({
            ...task,
            ...changes,
        });
        setMessage('');
        setError('');

        try {
            setSaving(true);

            const updated = await apiRequest(
                `/api/projects/${projectId}/tasks/${taskId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(changes),
                }
            );

            setTask(updated);
            setMessage(successMessage);
        } catch (error) {
            setTask(previous);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to update task.'
            );
        } finally {
            setSaving(false);
        }
    }

    function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const nextStatus = event.target.value;

        saveTask(
            { status: nextStatus },
            `Status updated to ${statusLabel(nextStatus)}.`,
        );
    }

    function handlePriorityChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const nextPriority = event.target.value;

        saveTask(
            { priority: nextPriority },
            `Priority updated to ${priorityLabel(nextPriority)}.`,
        );
    }

    function handleDueDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        const nextDate = event.target.value;

        saveTask(
            { due_date: nextDate || null },
            nextDate ? 'Due date updated.' : 'Due date removed.',
        );
    }

    function handleSaveDetails() {
        if (!task || !task.title.trim()) {
            setError('Title is required.');
            return;
        }

        saveTask(
            {
                title: task.title.trim(),
                description: task.description?.trim() || null,
                assignee: task.assignee?.trim() || null,
            },
            'Task details saved.',
        );
    }

    async function handleCreateComment(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!commentBody.trim()) {
            setCommentError('Comment is required.');
            return;
        }

        try {
            setSavingComment(true);
            setCommentError('');

            const comment = await apiRequest(
                `/api/projects/${projectId}/tasks/${taskId}/comments`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        body: commentBody.trim(),
                    }),
                }
            );

            setComments((current) => [comment, ...current]);
            setCommentBody('');
            setIsModalOpen(false);
        } catch (error) {
            setCommentError(
                error instanceof Error
                    ? error.message
                    : 'Unable to add comment.'
            );
        } finally {
            setSavingComment(false);
        }
    }

    async function handleDeleteTask() {
        if (!task) {
            return;
        }

        if (!window.confirm('Delete this task and its comments?')) {
            return;
        }

        try {
            await apiRequest(
                `/api/projects/${projectId}/tasks/${taskId}`,
                { method: 'DELETE' }
            );
            router.push(`/projects/${projectId}/tasks`);
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Unable to delete task.'
            );
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
                                Task: {loading ? 'Loading...' : task?.title ?? 'Task not found'}
                            </h2>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                type='button'
                                onClick={handleDeleteTask}
                                className='bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg cursor-pointer'
                            >
                                Delete
                            </button>
                            <Link href={`/projects/${projectId}/tasks`} className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>View All</Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5">
                        <div className='flex justify-between gap-3 items-center w-full'>
                            <h3 className='p-4 text-2xl'>Progress: {loading ? '...' : `${progress}%`}</h3>
                        </div>

                        <div className='p-4'>
                            <div className="w-full max-w-md">
                                <div className="h-5 w-full overflow-hidden bg-gray-200">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${loading ? 0 : progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5 p-4">
                        <div className='flex justify-between gap-3 items-center'>
                            <h3 className='text-2xl'>Details</h3>
                        </div>
                        {saving && (
                            <p className='mt-4 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700'>
                                Saving...
                            </p>
                        )}
                        {message && (
                            <p className='mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700'>
                                {message}
                            </p>
                        )}
                        {error && (
                            <p className='mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600'>
                                {error}
                            </p>
                        )}
                        <div className='space-y-5 mt-5'>
                            <div className='gap-5 flex justify-between'>
                                <div className='flex items-center justify-between w-1/2 gap-4'>
                                    <label className='text-sm font-medium text-gray-700'>Status</label>
                                    <select
                                        value={task?.status ?? 'todo'}
                                        onChange={handleStatusChange}
                                        disabled={saving || !task}
                                        className='p-2 bg-gray-100 rounded-xl'
                                    >
                                        <option value='todo'>To do</option>
                                        <option value='in_progress'>In progress</option>
                                        <option value='done'>Done</option>
                                    </select>
                                </div>
                            </div>
                            <div className='gap-5 flex justify-between'>
                                <div className='flex items-center justify-between w-1/2 gap-4'>
                                    <label className='text-sm font-medium text-gray-700'>Priority</label>
                                    <select
                                        value={task?.priority ?? 'medium'}
                                        onChange={handlePriorityChange}
                                        disabled={saving || !task}
                                        className='p-2 bg-gray-100 rounded-xl'
                                    >
                                        <option value='high'>High</option>
                                        <option value='medium'>Medium</option>
                                        <option value='low'>Low</option>
                                    </select>
                                </div>
                            </div>
                            <div className='gap-5 flex justify-between'>
                                <div className='flex items-center justify-between w-1/2 gap-4'>
                                    <label className='text-sm font-medium text-gray-700'>Due Date</label>
                                    <input
                                        type='date'
                                        value={task?.due_date ?? ''}
                                        onChange={handleDueDateChange}
                                        disabled={saving || !task}
                                        className='p-2 bg-gray-100 rounded-xl'
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Title</label>
                                <input
                                    type='text'
                                    value={task?.title ?? ''}
                                    onChange={(event) => {
                                        if (!task) {
                                            return;
                                        }

                                        setTask({
                                            ...task,
                                            title: event.target.value,
                                        });
                                    }}
                                    className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Assignee</label>
                                <input
                                    type='text'
                                    value={task?.assignee ?? ''}
                                    onChange={(event) => {
                                        if (!task) {
                                            return;
                                        }

                                        setTask({
                                            ...task,
                                            assignee: event.target.value,
                                        });
                                    }}
                                    disabled={!task}
                                    className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Description</label>
                                <textarea
                                    value={task?.description ?? ''}
                                    onChange={(event) => {
                                        if (!task) {
                                            return;
                                        }

                                        setTask({
                                            ...task,
                                            description: event.target.value,
                                        });
                                    }}
                                    disabled={!task}
                                    rows={4}
                                    className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                ></textarea>
                            </div>
                            <div className='flex justify-end'>
                                <button
                                    type='button'
                                    onClick={handleSaveDetails}
                                    disabled={saving || !task}
                                    className='text-white py-2 px-3 bg-black rounded-lg disabled:opacity-50'
                                >
                                    Save details
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5">
                        <div className='flex justify-between gap-3 items-center w-full'>
                            <h3 className='p-4 text-2xl'>Comments</h3>
                            <div>
                                <button onClick={() => setIsModalOpen(true)} className='bg-green-600 hover:bg-green-800 text-white p-2 rounded-lg cursor-pointer mr-3'>Add New</button>
                            </div>
                        </div>
                        <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Comment</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {commentsLoading ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-6 text-center">
                                            Loading comments...
                                        </td>
                                    </tr>
                                ) : comments.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-6 text-center text-gray-500">
                                            No comments yet.
                                        </td>
                                    </tr>
                                ) : (
                                    comments.map((comment) => (
                                        <tr key={comment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{comment.body}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{comment.author_name}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {isModalOpen &&
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
                        <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                            <form onSubmit={handleCreateComment} className='flex flex-col gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium text-gray-700'>Comment</label>
                                    <textarea
                                        value={commentBody}
                                        onChange={(event) => setCommentBody(event.target.value)}
                                        className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    ></textarea>
                                </div>
                                {commentError && (
                                    <p className='text-sm text-red-600'>{commentError}</p>
                                )}
                                <div className='flex justify-end gap-2'>
                                    <button type='button' onClick={() => setIsModalOpen(false)} className='text-black py-1 px-3 bg-gray-300 rounded-lg'>Cancel</button>
                                    <button type='submit' disabled={savingComment} className='text-white py-1 px-3 bg-black rounded-lg'>
                                        {savingComment ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                }

            </main>
        </div>
    )
}