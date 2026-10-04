'use client';

import { useRouter } from "next/navigation";

type Workspace = {
    id: string;
    name: string;
    color: string;
    owner_id: string;
};

type WorkspaceListProps = {
    workspaces: Workspace[];
};

export default function WorkspaceList({
    workspaces,
}: WorkspaceListProps) {

    const router=useRouter();

    if (workspaces.length === 0) {
        return null;
    }

    

    return (
        <div className="w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">
                Your Workspaces
            </h2>

            <div className="grid gap-3">
                {workspaces.map((workspace) => (
                    <div
                        key={workspace.id}
                        className="flex items-center justify-between border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                    backgroundColor: workspace.color,
                                }}
                            />

                            <div>
                                <h3 className="font-medium">
                                    {workspace.name}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Workspace
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="px-3 py-1.5 bg-black text-white rounded-lg text-sm cursor-pointer"
                            onClick={()=>router.push(`/workspace/${workspace.id}`)}
                        >
                            Open
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}