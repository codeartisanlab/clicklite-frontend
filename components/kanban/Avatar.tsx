import Image from 'next/image'
import React from 'react'

export default function Avatar() {
  return (
    <div className='flex justify-between items-center gap-2'>
        <div>
            <Image src="/globe.svg" width={15} height={15} alt='Avatar' />
        </div>
        <div className='text-xs'>Suraj Kumar</div>
    </div>
  )
}
