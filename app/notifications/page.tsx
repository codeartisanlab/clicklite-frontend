'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

export default function Notifications() {
  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex justify-between w-full items-center'>
                    <div>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Notifications</h2>
                    </div>
                </div>
 
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-900">Ref</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-500">
                                  Landing page marked as completed
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-500">
                                  Landing page marked as completed
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-500">
                                  Landing page marked as completed
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </main>


    </div>
  )
}
