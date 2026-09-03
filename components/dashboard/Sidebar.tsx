import React, { useState } from 'react'
import { LayoutDashboard, FolderKanban, SlidersHorizontal, LogOut,Calendar,Users,User } from 'lucide-react';
import Link from 'next/link';
export default function Sidebar() {
    const [IsModalOpen,setIsModalOpen]=useState(false);
  return (
    <aside className='w-64 border-r border-gray-200 min-h-screen'>
            <ul className='flex flex-col gap-2 p-3'>
                <li>
                    <Link href='/dashboard' className='bg-gray-300 p-2 rounded-md flex gap-2'>
                        <LayoutDashboard />
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href='/projects' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                        <FolderKanban />
                        Projects
                    </Link>
                </li>
                <li>
                    <Link href='/calender' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                        <Calendar />
                        Calender
                    </Link>
                </li>
                <li>
                    <Link href='/members' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                        <Users />
                        Members
                    </Link>
                </li>
                <li>
                    <Link href='#' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                        <SlidersHorizontal />
                        Settings
                    </Link>
                </li>
                <li>
                    <Link href='/auth/profile' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                        <User />
                        Profile
                    </Link>
                </li>
                <li>
                    <span onClick={()=>setIsModalOpen(true)} className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                        <LogOut />
                        Logout
                    </span>
                </li>
            </ul>

            {/* Modal */}
          {IsModalOpen &&
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
              <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                  <form className='flex flex-col gap-4'>
                      <p className='text-center text-3xl text-red-600'>Are you sure?</p>
                      <div className='flex justify-end gap-2'>
                          <button type='button' onClick={()=>setIsModalOpen(false)} className='text-black py-1 px-3 bg-gray-300 rounded-lg'>Cancel</button>
                          <button className='text-white py-1 px-3 bg-black rounded-lg'>Yes</button>
                      </div>
                  </form>
              </div>
          </div>
        }

        </aside>
  )
}
