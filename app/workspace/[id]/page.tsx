'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';


export default function WorkspaceDashboard() {
  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex justify-between w-full items-center'>
                    <div>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Workspace: ClickLite Development</h2>
                    </div>
                    <div>
                        <button className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>Create Project</button>
                    </div>
                </div>

                <div className='flex gap-3 mt-5'>
                    <div className='text-black font-semibold py-1 px-3'>Projects</div>
                    <div className='text-black font-semibold py-1 px-3'>Tasks</div>
                    <div className='text-black font-semibold py-1 px-3 bg-gray-300 rounded-lg'>Members</div>
                </div>
 
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
    </div>
  )
}
