import Image from 'next/image';

export default function Avatar({ name }: { name: string | null }) {
    return (
        <div className='flex justify-between items-center gap-2'>
            <div>
                <Image src="/globe.svg" width={15} height={15} alt='Avatar' />
            </div>
            <div className='text-xs'>{name?.trim() || 'Unassigned'}</div>
        </div>
    );
}
