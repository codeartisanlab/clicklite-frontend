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

    const [projects, setProjects] = useState<Project[]>([]);
    const [projectLoading, setProjectLoading] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    
    const params = useParams();
    const workspaceId = params.id as string;

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

  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex justify-between w-full items-center'>
                    <div className='flex items-center gap-2'>
                        <div
                            className="h-4 w-4 rounded-full"
                            style={{
                                backgroundColor: workspace.color,
                            }}
                        />
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Workspace: {workspace.name}</h2>
                    </div>
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
                    <div className='flex justify-between gap-3 items-center w-full'>
                        <h3 className='p-4 text-2xl'>Recent Activity</h3>
                        <button className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer mr-3'>View All</button>
                    </div>
                    <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Role</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Email</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Jane Doe</td>
                                <td className="px-6 py-4">Software Engineer</td>
                                <td className="px-6 py-4">jane@example.com</td>
                                <td className="px-6 py-4 text-emerald-600">Active</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Alex Smith</td>
                                <td className="px-6 py-4">Product Designer</td>
                                <td className="px-6 py-4">alex@example.com</td>
                                <td className="px-6 py-4 text-amber-600">Pending</td>
                            </tr>
                        </tbody>
                    </table>
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
