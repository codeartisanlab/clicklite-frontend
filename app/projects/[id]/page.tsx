'use client';

import { apiRequest } from '@/app/lib/api';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import Link from 'next/link';
import { useRouter,useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectDashboard() {

    const router=useRouter();
    
    
    type Project = {
        id: string;
        name: string;
        description: string | null;
        workspace_id: string;
        workspace_name: string;
    };

    const [ProjectDetail, setProjectDetail] = useState<Project | null>(null);
    const [projectLoading, setProjectLoading] = useState(true);

    const params = useParams();
    const projectId = params.id as string;

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await apiRequest(
                    `/api/projects/detail/${projectId}`
                );
                setProjectDetail(data);
            } catch (error) {
                console.error(
                    'Project loading error:',
                    error
                );
            } finally {
                setProjectLoading(false);
            }
        }

        if (projectId) {
            loadProjects();
        }
    }, [projectId]);

  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex justify-between w-full items-center'>
                    <div>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Project: {ProjectDetail?.name}</h2>
                        <p className='text-sm text-gray-600 mt-2'>{ProjectDetail?.description}</p>
                    </div>
                    <div>
                        <button className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>Create Task</button>
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

                {/* Due Tasks */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5">
                    <div className='flex justify-between gap-3 items-center w-full'>
                        <h3 className='p-4 text-2xl'>Tasks Due</h3>
                        <Link href={'/projects/1/tasks'} className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer mr-3'>View All</Link>
                    </div>
                    <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-900">Name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Task 3</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Task 4</td>
                            </tr>
                        </tbody>
                    </table>
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
                                <th className="px-6 py-3 font-semibold text-gray-900">Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Task 1 completed</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Task 2 started</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </main>
    </div>
  )
}
