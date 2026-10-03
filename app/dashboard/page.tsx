'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState,SubmitEvent } from 'react';
import { apiRequest } from '../lib/api';
import WorkSpaceList from '@/components/dashboard/WorkSpaceList';

export default function Dashboard() {
    const router = useRouter();

    const [user, setUser] = useState<{
        id: string;
        full_name: string;
        email: string;
    } | null>(null);


    const [loading, setLoading] = useState(true);

    const [IsModalOpen, setIsModalOpen] = useState(false);

    const [workspaceName, setWorkspaceName] = useState('');
    const [workspaceColor, setWorkspaceColor] = useState('#000000');
    const [creatingWorkspace, setCreatingWorkspace] = useState(false);


    type Workspace = {
        id: string;
        name: string;
        color: string;
        owner_id: string;
    };

    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [workspaceLoading, setWorkspaceLoading] = useState(true);

    useEffect(() => {
        async function loadWorkspaces() {
            try {
                const data = await apiRequest('/api/workspaces');

                setWorkspaces(data);
            } catch (error) {
                console.error('Workspace loading error:', error);
            } finally {
                setWorkspaceLoading(false);
            }
        }

        loadWorkspaces();
    }, []);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await apiRequest('/api/auth/me');

                setUser(data);
            } catch (error) {
                console.error('Authentication error:', error);

                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [router]);

    async function handleCreateWorkspace(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!workspaceName.trim()) {
            return;
        }

        try {
            setCreatingWorkspace(true);

            const newWorkspace = await apiRequest('/api/workspaces', {
                method: 'POST',
                body: JSON.stringify({
                    name: workspaceName.trim(),
                    color: workspaceColor,
                }),
            });

            setWorkspaces((current) => [
                ...current,
                newWorkspace,
            ]);

            setWorkspaceName('');
            setWorkspaceColor('#000000');
            setIsModalOpen(false);

            router.push('/dashboard');
        } catch (error) {
            console.error('Create workspace error:', error);
        } finally {
            setCreatingWorkspace(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }


    return (
        <div>
            <Header />

            <main className="flex">
                <Sidebar />

<div className="flex flex-1 items-center justify-center p-6">

    {workspaceLoading ? (
        <p className="text-gray-500">
            Loading workspaces...
        </p>
    ) : workspaces.length === 0 ? (

        <div className="border-gray-200 border flex justify-center items-center flex-col gap-4 w-3xl p-5 shadow-md rounded-md">

            <h2 className="text-2xl">
                Welcome {user?.full_name}
            </h2>

            <p className="text-lg">
                No workspace found
            </p>

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer"
            >
                Create workspace
            </button>

        </div>

    ) : (

        <div className="w-full max-w-3xl">

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl">
                    Welcome {user?.full_name}
                </h2>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer"
                >
                    Create workspace
                </button>

            </div>

            <WorkSpaceList workspaces={workspaces} />

        </div>

    )}

</div>

                {/* Create Workspace Modal */}
                {IsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">

                        <div className="w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl">

                            <h2 className="text-xl font-semibold mb-4">
                                Create Workspace
                            </h2>

                            <form
                                onSubmit={handleCreateWorkspace}
                                className="flex flex-col gap-4"
                            >

                                {/* Workspace Name */}
                                <div className="flex flex-col gap-1">

                                    <label className="text-sm font-medium text-gray-700">
                                        Workspace Name
                                    </label>

                                    <input
                                        type="text"
                                        value={workspaceName}
                                        onChange={(event) =>
                                            setWorkspaceName(event.target.value)
                                        }
                                        placeholder="Personal Workspace"
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                </div>

                                {/* Workspace Color */}
                                <div className="flex flex-col gap-1">

                                    <label className="text-sm font-medium text-gray-700">
                                        Workspace Color
                                    </label>

                                    <input
                                        type="color"
                                        value={workspaceColor}
                                        onChange={(event) =>
                                            setWorkspaceColor(event.target.value)
                                        }
                                        className="h-10 w-full cursor-pointer rounded-md border border-gray-300"
                                    />

                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-2">

                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-black py-2 px-3 bg-gray-300 rounded-lg"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={creatingWorkspace}
                                        className="text-white py-2 px-3 bg-black rounded-lg disabled:opacity-50"
                                    >
                                        {creatingWorkspace
                                            ? 'Creating...'
                                            : 'Create'}
                                    </button>

                                </div>

                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}