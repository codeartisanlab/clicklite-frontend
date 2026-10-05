'use client';

import { useState, SubmitEvent } from 'react';
import { apiRequest } from '@/app/lib/api';

type Project = {
    id: string;
    name: string;
    description: string | null;
    workspace_id: string;
};

type CreateProjectModalProps = {
    workspaceId: string;
    onClose: () => void;
    onCreated: (project: Project) => void;
};

export default function CreateProjectModal({
    workspaceId,
    onClose,
    onCreated,
}: CreateProjectModalProps) {

    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!projectName.trim()) {
            return;
        }

        try {
            setCreating(true);

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
            onClose();

        } catch (error) {
            console.error('Create project error:', error);
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">

            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-5 shadow-xl">

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