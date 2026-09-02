"use client"
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/dashboard/Sidebar'
import KanbanColumn from '@/components/kanban/KanbanColumn'
import React from 'react'

export default function page() {
  return (
    <div>
        <Header />
        <main className='flex'>
        <Sidebar />
            <div className='p-4 w-1/2'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <KanbanColumn columnName="Todo" />
                    <KanbanColumn columnName="Progress" />
                    <KanbanColumn columnName="Completed" />
                </div>
            </div>
        </main>
    </div>
  )
}
