'use client';

import { apiRequest } from '@/app/lib/api';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useEffect, useState } from 'react';

type Workspace = {
    id: string;
    name: string;
};

type Member = {
    id: string;
    full_name: string;
    email: string;
    role: string;
};

export default function Members() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [workspaceId, setWorkspaceId] = useState('');
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadWorkspaces() {
            try {
                const data = await apiRequest('/api/workspaces');
                setWorkspaces(data);

                if (data.length > 0) {
                    setWorkspaceId(data[0].id);
                }
            } catch (loadError) {
                console.error('Workspace loading error:', loadError);
            } finally {
                setLoading(false);
            }
        }

        loadWorkspaces();
    }, []);

    useEffect(() => {
        async function loadMembers() {
            try {
                const data = await apiRequest(
                    `/api/workspaces/${workspaceId}/members`
                );
                setMembers(data);
            } catch (loadError) {
                console.error('Member loading error:', loadError);
            }
        }

        if (workspaceId) {
            loadMembers();
        }
    }, [workspaceId]);

    async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email.trim()) {
            setError('Email is required.');
            return;
        }

        try {
            setSaving(true);
            setError('');

            const member = await apiRequest(
                `/api/workspaces/${workspaceId}/members`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email.trim(),
                        role,
                    }),
                }
            );

            setMembers((current) => [...current, member]);
            setEmail('');
            setRole('member');
            setIsModalOpen(false);
        } catch (inviteError) {
            setError(
                inviteError instanceof Error
                    ? inviteError.message
                    : 'Unable to invite member.'
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
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Members</h2>
                        <button
                            type='button'
                            onClick={() => setIsModalOpen(true)}
                            disabled={!workspaceId}
                            className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer disabled:opacity-50'
                        >
                            Add New
                        </button>
                    </div>

                    <select
                        value={workspaceId}
                        onChange={(event) => setWorkspaceId(event.target.value)}
                        className='w-full max-w-sm p-2 border border-gray-300 rounded-md'
                    >
                        {workspaces.map((workspace) => (
                            <option key={workspace.id} value={workspace.id}>
                                {workspace.name}
                            </option>
                        ))}
                    </select>

                    <div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
                        <table className='w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-3 font-semibold text-gray-900'>Name</th>
                                    <th className='px-6 py-3 font-semibold text-gray-900'>Email</th>
                                    <th className='px-6 py-3 font-semibold text-gray-900'>Role</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className='px-6 py-6 text-center'>
                                            Loading members...
                                        </td>
                                    </tr>
                                ) : members.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className='px-6 py-6 text-center text-gray-500'>
                                            No members yet.
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member) => (
                                        <tr key={member.id} className='hover:bg-gray-50'>
                                            <td className='px-6 py-4 font-medium text-gray-900'>{member.full_name}</td>
                                            <td className='px-6 py-4'>{member.email}</td>
                                            <td className='px-6 py-4'>{member.role}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
                    <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                        <form onSubmit={handleInvite} className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Email</label>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Role</label>
                                <select
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                    className='px-3 py-1 border border-gray-300 rounded-md'
                                >
                                    <option value='member'>Member</option>
                                    <option value='developer'>Developer</option>
                                    <option value='designer'>Designer</option>
                                </select>
                            </div>
                            {error && (
                                <p className='text-sm text-red-600'>{error}</p>
                            )}
                            <div className='flex justify-end gap-2'>
                                <button
                                    type='button'
                                    onClick={() => setIsModalOpen(false)}
                                    className='text-black py-1 px-3 bg-gray-300 rounded-lg'
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={saving}
                                    className='text-white py-1 px-3 bg-black rounded-lg'
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}