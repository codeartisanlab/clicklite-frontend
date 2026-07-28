'use client';

import React, { useState } from 'react';
import { Bell,Settings,LayoutDashboard, FolderKanban, SlidersHorizontal, LogOut } from 'lucide-react';

export default function Dashboard() {
    const [IsModalOpen,setIsModalOpen]=useState(false);
  return (
    <div>
        <header className='flex items-center justify-between p-5 border-b border-gray-200 h-16'>
            <div className='w-64 flex items-center gap-3'>
                <div className='bg-black text-white rounded-xs w-8 h-8 justify-center flex items-center font-bold'>C</div>
                <div>
                    <h1 className='font-bold text-2xl'>ClickLite</h1>
                </div>
            </div>
            <div>
                <input type='text' placeholder='search' className='bg-gray-100 border w-lg border-gray-400 p-1 rounded-lg' />
            </div>
            <div className='flex justify-end gap-5'>
                
                <div>
                    <Bell />
                </div>
                <div>
                    <Settings />
                </div>
            </div>
        </header>
        <main className='flex'>
            <aside className='w-64 border-r border-gray-200 min-h-screen'>
                <ul className='flex flex-col gap-2 p-3'>
                    <li>
                        <a href='#' className='bg-gray-300 p-2 rounded-md flex gap-2'>
                            <LayoutDashboard />
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href='#' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                            <FolderKanban />
                            Projects
                        </a>
                    </li>
                    <li>
                        <a href='#' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                            <SlidersHorizontal />
                            Settings
                        </a>
                    </li>
                    <li>
                        <a href='#' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                            <LogOut />
                            Logout
                        </a>
                    </li>
                </ul>
            </aside>
            <div className='flex flex-1 items-center justify-center'>
                <div className='border-gray-200 border flex justify-center items-center flex-col gap-4 w-3xl p-5 shadow-md rounded-md'>
                    <h2 className='text-2xl'>Welcome</h2>
                    <p className='text-lg'>No workspace found</p>
                    <button onClick={()=>setIsModalOpen(true)} className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>Create workspace</button>
                </div>
            </div>

            {/* Modal */}
            {IsModalOpen &&
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
                <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                    <form className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-medium text-gray-700'>Full Name</label>
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
