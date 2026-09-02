import React from 'react'
import PriorityBadge from './PriorityBadge'
import Avatar from './Avatar'

export default function TaskCard({priority}:{priority:string}) {
  return (
    <article className='w-full space-y-3 bg-amber-50 p-2 border border-amber-100 rounded-md'>
        <div>
            <h3 className='text-sm border-b border-gray-100'>Task Title</h3>
        </div>
        <div className='flex justify-between'>
            <PriorityBadge priority={priority} />
            <Avatar />
        </div>
    </article>
  )
}
