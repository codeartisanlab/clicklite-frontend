'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '../lib/api';
import CreateProjectModal from '@/components/project/ProjectCreateModal';

export default function ProjectList() {

    const router = useRouter();

    type Workspace = {
        id: string;
        name: string;
        color: string;
    };

    type Project = {
        id: string;
        name: string;
        description: string | null;
        workspace_id: string;
        workspace_name:string;
    };

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [projectsData, workspacesData] = await Promise.all([
                    apiRequest('/api/projects'),
                    apiRequest('/api/workspaces'),
                ]);

                setProjects(projectsData);
                setWorkspaces(workspacesData);
            } catch (error) {
                console.error('Project page loading error:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex justify-between w-full items-center'>
                    <div>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Projects</h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Create Project
                    </button>
                </div>
 
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Workspace</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-6 text-center"
                                    >
                                        Loading projects...
                                    </td>
                                </tr>

                            ) : projects.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-6 text-center text-gray-500"
                                    >
                                        No projects found.
                                    </td>
                                </tr>

                            ) : (

                                projects.map((project) => (

                                    <tr
                                        key={project.id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/projects/${project.id}`
                                                    )
                                                }
                                                className="hover:underline"
                                            >
                                                {project.name}
                                            </button>
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/workspace/${project.workspace_id}`
                                                    )
                                                }
                                                className="hover:underline"
                                            >
                                                {project.workspace_name}
                                            </button>
                                        </td>

                                        <td className="px-6 py-4">
                                            Active
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>
                    </table>
                </div>
                

                {isModalOpen && (
                    <CreateProjectModal
                        workspaces={workspaces}
                        onClose={() => setIsModalOpen(false)}
                        onCreated={(project) => {
                            setProjects((current) => [project, ...current]);
                        }}
                    />
                )}

            </div>
        </main>

    </div>
  )
}
