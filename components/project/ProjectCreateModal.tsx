'use client';

import { SubmitEvent, useState } from 'react';
import { apiRequest } from '@/app/lib/api';

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
    workspace_name: string;
};

type CreateProjectModalProps = {
    workspaces: Workspace[];
    defaultWorkspaceId?: string;
    onClose: () => void;
    onCreated: (project: Project) => void;
};

export default function CreateProjectModal({
    workspaces,
    defaultWorkspaceId,
    onClose,
    onCreated,
}: CreateProjectModalProps) {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [workspaceId, setWorkspaceId] = useState(
        defaultWorkspaceId || ''
    );
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!projectName.trim()) {
            setError('Project name is required.');
            return;
        }

        if (!workspaceId) {
            setError('Please select a workspace.');
            return;
        }

        try {
            setCreating(true);
            setError('');

            const project = await apiRequest('/api/projects', {
                method: 'POST',
                body: JSON.stringify({
                    name: projectName.trim(),
                    description: description.trim() || null,
                    workspace_id: workspaceId,
                }),
            });

            onCreated(project);

            setProjectName('');
            setDescription('');
            setWorkspaceId(defaultWorkspaceId || '');

            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to create project.'
            );
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-5 shadow-xl">

                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Create Project
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    {/* Project Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Project Name
                        </label>

                        <input
                            type="text"
                            value={projectName}
                            onChange={(event) =>
                                setProjectName(event.target.value)
                            }
                            placeholder="ClickLite Backend"
                            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="Project description"
                            rows={4}
                            className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Workspace */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Workspace
                        </label>

                        <select
                            value={workspaceId}
                            onChange={(event) =>
                                setWorkspaceId(event.target.value)
                            }
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">
                                Select workspace
                            </option>

                            {workspaces.map((workspace) => (
                                <option
                                    key={workspace.id}
                                    value={workspace.id}
                                >
                                    {workspace.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-300 px-3 py-2 text-black"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={creating}
                            className="rounded-lg bg-black px-3 py-2 text-white disabled:opacity-50"
                        >
                            {creating
                                ? 'Creating...'
                                : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}