import React from 'react'
import { Bell,Settings } from 'lucide-react';
import Link from 'next/link';
export default function Header() {
  return (
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
                <Link href={'/notifications'}><Bell /></Link>
            </div>
            <div>
                <Link href={'/auth/profile'}><Settings /></Link>
                
            </div>
        </div>
    </header>
  )
}