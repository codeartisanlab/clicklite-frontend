'use client';

import { apiRequest } from '@/app/lib/api';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Task = {
    id: string;
    title: string;
    status: string;
    priority: string;
    assignee: string | null;
};

const columns = [
    { status: 'todo', title: 'To do' },
    { status: 'in_progress', title: 'In progress' },
    { status: 'done', title: 'Done' },
];

export default function KanbanPage() {
    const params = useParams();
    const projectId = params.id as string;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = await apiRequest(
                    `/api/projects/${projectId}/tasks`
                );
                setTasks(data);
            } catch (loadError) {
                console.error('Kanban loading error:', loadError);
            } finally {
                setLoading(false);
            }
        }

        if (projectId) {
            loadTasks();
        }
    }, [projectId]);

    async function moveTask(taskId: string, status: string) {
        const task = tasks.find((item) => item.id === taskId);

        if (!task || task.status === status) {
            return;
        }

        const previous = tasks;

        setTasks((current) =>
            current.map((item) =>
                item.id === taskId ? { ...item, status } : item
            )
        );
        setError('');

        try {
            await apiRequest(
                `/api/projects/${projectId}/tasks/${taskId}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ status }),
                }
            );
        } catch (moveError) {
            setTasks(previous);
            setError(
                moveError instanceof Error
                    ? moveError.message
                    : 'Unable to move task.'
            );
        }
    }

    return (
        <div>
            <Header />
            <main className='flex'>
                <Sidebar />
                <div className='flex-1 p-4'>
                    <h2 className='text-2xl font-semibold mb-4'>Kanban</h2>
                    {error && (
                        <p className='mb-4 text-sm text-red-600'>{error}</p>
                    )}
                    {loading ? (
                        <p className='text-gray-600'>Loading tasks...</p>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {columns.map((column) => (
                                <KanbanColumn
                                    key={column.status}
                                    projectId={projectId}
                                    title={column.title}
                                    status={column.status}
                                    tasks={tasks.filter(
                                        (task) => task.status === column.status
                                    )}
                                    onMove={moveTask}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}