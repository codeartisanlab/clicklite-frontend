'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

export default function Profile() {
  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex justify-between w-full items-center'>
                    <div>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Profile</h2>
                    </div>
                </div>
 
                <div className="overflow-x-auto rounded-lg">
                    <div className='w-full max-w-xl p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                        <form className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Name</label>
                                <input 
                                    type='text' 
                                    className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Email</label>
                                <input 
                                    type='email' 
                                    className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Phone</label>
                                <input 
                                    type='phone' 
                                    className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-sm font-medium text-gray-700'>Bio</label>
                                <textarea 
                                    className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                                ></textarea>
                            </div>
                            <div className='flex justify-end gap-2'>
                                <button className='text-white py-1 px-3 bg-black rounded-lg'>Save</button>
                            </div>
                        </form>
                    </div>
                </div>


            </div>
        </main>

    </div>
  )
}
