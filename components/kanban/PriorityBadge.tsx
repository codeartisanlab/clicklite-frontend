import React from 'react'

export default function PriorityBadge({priority}:{priority:string}) {
  return (
    <div className='text-gray-600 text-xs'>{priority}</div>
  )
}
