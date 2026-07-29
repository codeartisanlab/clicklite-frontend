import React from 'react'
import { LayoutDashboard, FolderKanban, SlidersHorizontal, LogOut } from 'lucide-react';
export default function Sidebar() {
  return (
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
  )
}
