'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import React, { useState } from 'react';
import Link from 'next/link';

export default function TaskList() {
  const [IsModalOpen,setIsModalOpen]=useState(false);
  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex justify-between w-full items-center'>
                    <div>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Tasks</h2>
                    </div>
                    <div>
                        <button onClick={()=>setIsModalOpen(true)} type='button' className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>Create Task</button>
                    </div>
                </div>
 
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Priority</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">Due Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                  <Link href={'/projects/1/tasks/1'}>Project 1</Link>
                                </td>
                                <td className="px-6 py-4">
                                  <Link href={'/projects/1/tasks/1'} className='text-red-600'>High</Link>
                                </td>
                                <td className="px-6 py-4">
                                  <Link href={'/projects/1/tasks/1'}>01/09/2026</Link>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">
                                  <Link href={'/projects/2/tasks/3'}>Project 1</Link>
                                </td>
                                <td className="px-6 py-4">
                                  <Link href={'/projects/2/tasks/3'} className='text-orange-600'>Low</Link>
                                </td>
                                <td className="px-6 py-4">
                                  <Link href={'/projects/2/tasks/3'}>03/09/2026</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </main>

        {/* Modal */}
          {IsModalOpen &&
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
              <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                  <form className='flex flex-col gap-4'>
                      <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-gray-700'>Title</label>
                          <input 
                              type='text' 
                              className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                          />
                      </div>
                      <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-gray-700'>Detail</label>
                          <textarea 
                              className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                          ></textarea>
                      </div>
                      <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-gray-700'>Priority</label>
                          <select className='p-2 bg-gray-100 rounded-xl w-1/2'>
                            <option>High</option>
                            <option>Low</option>
                            <option>Medium</option>
                          </select>
                      </div>
                      <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-gray-700'>Due Date</label>
                          <input type='date' className='p-2 bg-gray-100 rounded-xl w-1/2' />
                      </div>
                      <div className='flex justify-end gap-2'>
                          <button type='button' onClick={()=>setIsModalOpen(false)} className='text-black py-1 px-3 bg-gray-300 rounded-lg'>Cancel</button>
                          <button className='text-white py-1 px-3 bg-black rounded-lg'>Save</button>
                      </div>
                  </form>
              </div>
          </div>
        }

    </div>
  )
}
