"use client"

import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import Calendar from '@/components/utils/Calender'
import React from 'react'

export default function calender() {
  return (
    <div>
      <Header />
      <main className='flex'>
        <Sidebar />
        <div className='w-1/2 p-4'>
          <Calendar />
        </div>
      </main>
    </div>
  )
}
