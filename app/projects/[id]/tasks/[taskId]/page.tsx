'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/app/lib/api';

type Task = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    project_id: string;
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

export default function TaskDetail() {
    const params = useParams();
    const projectId = params.id as string;
    const taskId = params.taskId as string;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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

        if (projectId && taskId) {
            loadTask();
        }
    }, [projectId, taskId]);

    async function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
        if (!task) {
            return;
        }

        const nextStatus = event.target.value;
        const previousStatus = task.status;

        setTask({
            ...task,
            status: nextStatus,
        });
        setMessage('');
        setError('');

        try {
            setSaving(true);

            const updated = await apiRequest(
                `/api/projects/${projectId}/tasks/${taskId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        status: nextStatus,
                    }),
                }
            );

            setTask(updated);
            setMessage(`Status updated to ${statusLabel(updated.status)}.`);
        } catch (error) {
            setTask({
                ...task,
                status: previousStatus,
            });
            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to update status.'
            );
        } finally {
            setSaving(false);
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
                    <div>
                        <Link href={`/projects/${projectId}/tasks`} className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>View All</Link>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5">
                    <div className='flex justify-between gap-3 items-center w-full'>
                        <h3 className='p-4 text-2xl'>Progress: 70%</h3>
                    </div>

                    <div className='p-4'>
                        <div className="w-full max-w-md">
                            <div className="h-5 w-full overflow-hidden bg-gray-200">
                                <div className="h-full w-[70%] bg-blue-500"></div>
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
                            Saving status...
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
                            <div className='flex justify-between w-1/4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-700'>Status</label>
                                </div>
                                <div>
                                    <select
                                        value={task?.status ?? 'todo'}
                                        onChange={handleStatusChange}
                                        disabled={saving || !task}
                                        className='p-2 bg-gray-100 rounded-xl w-full'
                                    >
                                        <option value='todo'>To do</option>
                                        <option value='in_progress'>In progress</option>
                                        <option value='done'>Done</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='gap-5 flex justify-between'>
                            <div className='flex justify-between w-1/4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-700'>Priority</label>
                                </div>
                                <div>
                                    <select className='p-2 bg-gray-100 rounded-xl w-full'>
                                        <option>High</option>
                                        <option>Low</option>
                                        <option>Medium</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='gap-5 flex justify-between'>
                            <div className='flex justify-between w-1/4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-700'>Asignee</label>
                                </div>
                                <div>
                                    <select className='p-2 bg-gray-100 rounded-xl w-full' multiple>
                                        <option>Person 1</option>
                                        <option>Person 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <p className='text-md text-gray-700'>
                            {loading
                                ? 'Loading task...'
                                : task?.description || 'No description.'}
                        </p>
                    </div>

                </div>


                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5">
                    <div className='flex justify-between gap-3 items-center w-full'>
                        <h3 className='p-4 text-2xl'>Comments</h3>
                        <div>
                            <button className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer mr-3'>View All</button>
                            <button onClick={()=>setIsModalOpen(true)} className='bg-green-600 hover:bg-green-800 text-white p-2 rounded-lg cursor-pointer mr-3'>Add New</button>
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
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Comment 1</td>
                                <td className="px-6 py-4 font-medium text-gray-900">Suraj Kumar</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Comment 1</td>
                                <td className="px-6 py-4 font-medium text-gray-900">Suraj Kumar</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

          {isModalOpen &&
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
              <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                  <form className='flex flex-col gap-4'>

                      <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-gray-700'>Detail</label>
                          <textarea 
                              className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                          ></textarea>
                      </div>
                      <div className='flex justify-end gap-2'>
                          <button type='button' onClick={()=>setIsModalOpen(false)} className='text-black py-1 px-3 bg-gray-300 rounded-lg'>Cancel</button>
                          <button className='text-white py-1 px-3 bg-black rounded-lg'>Save</button>
                      </div>
                  </form>
              </div>
          </div>
        }

        </main>
    </div>
  )
}