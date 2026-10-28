'use client';

import { apiRequest } from '@/app/lib/api';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useParams } from 'next/navigation';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateProjectModal from '@/components/project/ProjectCreateModal';

export default function WorkspaceDashboard() {

    const router=useRouter();

    type Activity = {
        id: string;
        user_name: string;
        message: string;
        link: string;
        created_at: string;
    };

    type Workspace={
        id:string,
        name:string,
        color:string,
        owner_id:string
    }

    type Project = {
        id: string;
        name: string;
        description: string | null;
        workspace_id: string;
        workspace_name: string;
    };

    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [loading, setLoading] = useState(true);

    const [activities, setActivities] = useState<Activity[]>([]);

    const [projects, setProjects] = useState<Project[]>([]);
    const [projectLoading, setProjectLoading] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    
    const params = useParams();
    const workspaceId = params.id as string;


    useEffect(() => {
        async function loadActivity() {
            try {
                const data = await apiRequest(
                    `/api/workspaces/${workspaceId}/activity`
                );

                setActivities(data);
            } catch (error) {
                console.error('Activity loading error:', error);
            }
        }

        if (workspaceId) {
            loadActivity();
        }
    }, [workspaceId]);

    useEffect(() => {
        async function loadWorkspace() {
            try {
                const data = await apiRequest(
                    `/api/workspaces/${workspaceId}`
                );

                setWorkspace(data);
            } catch (error) {
                console.error(
                    'Workspace loading error:',
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        if (workspaceId) {
            loadWorkspace();
        }
    }, [workspaceId]);

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await apiRequest(
                    `/api/projects/${workspaceId}`
                );

                setProjects(data);
            } catch (error) {
                console.error(
                    'Project loading error:',
                    error
                );
            } finally {
                setProjectLoading(false);
            }
        }

        if (workspaceId) {
            loadProjects();
        }
    }, [workspaceId]);


    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading workspace...</p>
            </div>
        );
    }

    if (!workspace) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Workspace not found.</p>
            </div>
        );
    }


    async function saveWorkspace() {
        if (!workspace || workspace.name.trim().length < 2) {
            return;
        }

        const updated = await apiRequest(
            `/api/workspaces/${workspaceId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    name: workspace.name.trim(),
                    color: workspace.color,
                }),
            }
        );

        setWorkspace(updated);
    }

    async function deleteWorkspace() {
        if (!window.confirm('Delete this workspace and everything inside it?')) {
            return;
        }

        await apiRequest(
            `/api/workspaces/${workspaceId}`,
            { method: 'DELETE' }
        );

        router.push('/dashboard');
    }

  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex items-center gap-2'>
                    <input
                        type='color'
                        value={workspace.color}
                        onChange={(event) =>
                            setWorkspace({ ...workspace, color: event.target.value })
                        }
                    />
                    <input
                        type='text'
                        value={workspace.name}
                        onChange={(event) =>
                            setWorkspace({ ...workspace, name: event.target.value })
                        }
                        className='text-2xl font-semibold border-b border-gray-200 pb-1 bg-transparent focus:outline-none'
                    />
                </div>
                <div className='flex gap-2'>
                    <button type='button' onClick={saveWorkspace} className='bg-black text-white p-2 rounded-lg'>Save</button>
                    <button type='button' onClick={deleteWorkspace} className='bg-red-600 text-white p-2 rounded-lg'>Delete</button>
                </div>

                <div className='flex gap-3 mt-5'>
                    <div className='text-black font-semibold py-1 px-3 bg-gray-300 rounded-lg'>Projects</div>
                    <div className='text-black font-semibold py-1 px-3'>Tasks</div>
                    <div className='text-black font-semibold py-1 px-3 rounded-lg'>Members</div>
                </div>
 
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">

                    <div className="flex items-center justify-between">
                        <h3 className="p-4 text-2xl">
                            Projects
                        </h3>

                        <button
                            type="button"
                            onClick={() => setIsProjectModalOpen(true)}
                            className="mr-3 rounded-lg bg-black px-3 py-2 text-white hover:bg-gray-900"
                        >
                            Create Project
                        </button>
                    </div>

                    {projectLoading ? (
                        <div className="p-6">
                            <p className="text-gray-500">
                                Loading projects...
                            </p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="p-6">
                            <p className="text-gray-500">
                                No projects found.
                            </p>
                        </div>
                    ) : (
                        <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-900">
                                        Name
                                    </th>

                                    <th className="px-6 py-3 font-semibold text-gray-900">
                                        Description
                                    </th>

                                    <th className="px-6 py-3 font-semibold text-gray-900">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">

                                {projects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {project.name}
                                        </td>

                                        <td className="px-6 py-4">
                                            {project.description || '-'}
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/projects/${project.id}`
                                                    )
                                                }
                                                className="rounded-lg bg-black px-3 py-1.5 text-white"
                                            >
                                                Open
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5">
                    <h3 className="p-4 text-2xl">Recent Activity</h3>

                    {activities.length === 0 ? (
                        <div className="p-6">
                            <p className="text-gray-500">No activity yet.</p>
                        </div>
                    ) : (
                        <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Name</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">Activity</th>
                                    <th className="px-6 py-3 font-semibold text-gray-900">When</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {activities.map((activity) => (
                                    <tr
                                        key={activity.id}
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => router.push(activity.link)}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {activity.user_name}
                                        </td>
                                        <td className="px-6 py-4">{activity.message}</td>
                                        <td className="px-6 py-4">
                                            {new Date(activity.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </main>
        
        {isProjectModalOpen && (
            <CreateProjectModal
                workspaces={[
                    {
                        id: workspace.id,
                        name: workspace.name,
                        color: workspace.color,
                    },
                ]}
                defaultWorkspaceId={workspace.id}
                onClose={() => setIsProjectModalOpen(false)}
                onCreated={(project) => {
                    setProjects((current) => [project, ...current]);
                }}
            />
        )}

    </div>
  )
}
