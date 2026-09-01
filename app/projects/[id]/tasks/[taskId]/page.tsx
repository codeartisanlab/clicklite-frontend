'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import React, { useState } from 'react';

export default function TaskDetail() {
    const [IsModalOpen,setIsModalOpen]=useState(false);
  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 flex-col gap-4 p-5'>

                <div className='flex justify-between w-full items-center'>
                    <div>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>Task: Task Detail</h2>
                    </div>
                    <div>
                        <button className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>View All</button>
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

                {/* Detail */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5 p-4">
                    <div className='flex justify-between gap-3 items-center'>
                        <h3 className='text-2xl'>Details</h3>
                    </div>
                    <div className='space-y-5 mt-5'>
                        <div className='gap-5 flex justify-between'>
                            <div className='flex justify-between w-1/4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-700'>Status</label>
                                </div>
                                <div>
                                    <select className='p-2 bg-gray-100 rounded-xl w-full'>
                                        <option>Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='gap-5 flex justify-between'>
                            <div className='flex justify-between w-1/4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-700'>Priority</label>
                                </div>
                                <div>
                                    <select className='p-2 bg-gray-100 rounded-xl w-full'>
                                        <option>High</option>
                                        <option>Low</option>
                                        <option>Medium</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='gap-5 flex justify-between'>
                            <div className='flex justify-between w-1/4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-700'>Asignee</label>
                                </div>
                                <div>
                                    <select className='p-2 bg-gray-100 rounded-xl w-full' multiple>
                                        <option>Person 1</option>
                                        <option>Person 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <p className='text-md text-gray-700'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, rem vero? Totam esse pariatur aliquid saepe velit porro consectetur, laudantium odio iusto delectus quo minus a at, modi, vero culpa!
                        </p>
                    </div>

                </div>


                {/* Comments */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-5">
                    <div className='flex justify-between gap-3 items-center w-full'>
                        <h3 className='p-4 text-2xl'>Comments</h3>
                        <div>
                            <button className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer mr-3'>View All</button>
                            <button onClick={()=>setIsModalOpen(true)} className='bg-green-600 hover:bg-green-800 text-white p-2 rounded-lg cursor-pointer mr-3'>Add New</button>
                        </div>
                    </div>
                    <table className="w-full min-w-full divide-y divide-gray-200 bg-white text-left text-sm text-gray-500">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-gray-900">Comment</th>
                                <th className="px-6 py-3 font-semibold text-gray-900">By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Comment 1</td>
                                <td className="px-6 py-4 font-medium text-gray-900">Suraj Kumar</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Comment 1</td>
                                <td className="px-6 py-4 font-medium text-gray-900">Suraj Kumar</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
          {IsModalOpen &&
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
              <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                  <form className='flex flex-col gap-4'>

                      <div className='flex flex-col gap-1'>
                          <label className='text-sm font-medium text-gray-700'>Detail</label>
                          <textarea 
                              className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                          ></textarea>
                      </div>
                      <div className='flex justify-end gap-2'>
                          <button type='button' onClick={()=>setIsModalOpen(false)} className='text-black py-1 px-3 bg-gray-300 rounded-lg'>Cancel</button>
                          <button className='text-white py-1 px-3 bg-black rounded-lg'>Save</button>
                      </div>
                  </form>
              </div>
          </div>
        }

        </main>
    </div>
  )
}
