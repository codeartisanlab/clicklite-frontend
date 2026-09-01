import React from 'react'
import { LayoutDashboard, FolderKanban, SlidersHorizontal, LogOut } from 'lucide-react';
import Link from 'next/link';
export default function Sidebar() {
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
                    <Link href='#' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                        <SlidersHorizontal />
                        Settings
                    </Link>
                </li>
                <li>
                    <Link href='#' className='hover:bg-gray-300 p-2 rounded-md flex gap-2'>
                        <LogOut />
                        Logout
                    </Link>
                </li>
            </ul>
        </aside>
  )
}
