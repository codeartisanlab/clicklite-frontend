import React from 'react'
import TaskCard from './TaskCard'

export default function KanbanColumn({columnName}:{columnName:string}) {
  return (
    <section className={`p-3 border-gray-200 border rounded-md `}>
      <h3 className='text-center text-md border-b pb-1 border-gray-200'>{columnName}</h3>
      <div className='flex flex-col gap-3 my-3'>
        <TaskCard priority="high" />
        <TaskCard priority="low" />
      </div>
    </section>
  )
}
