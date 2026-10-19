import Link from 'next/link';
import PriorityBadge from './PriorityBadge';
import Avatar from './Avatar';

type TaskCardProps = {
    projectId: string;
    task: {
        id: string;
        title: string;
        priority: string;
        assignee: string | null;
    };
};



export default function TaskCard({ projectId, task }: TaskCardProps) {
    function handleDragStart(event: React.DragEvent<HTMLElement>) {
        event.dataTransfer.setData('text/plain', task.id);
        event.dataTransfer.effectAllowed = 'move';
    }

    return (
        <article
            draggable
            onDragStart={handleDragStart}
            className='w-full space-y-3 bg-amber-50 p-2 border border-amber-100 rounded-md cursor-grab'
        >
            <div>
                <h3 className='text-sm border-b border-gray-100'>
                    <Link href={`/projects/${projectId}/tasks/${task.id}`}>
                        {task.title}
                    </Link>
                </h3>
            </div>
            <div className='flex justify-between'>
                <PriorityBadge priority={task.priority} />
                <Avatar name={task.assignee} />
            </div>
        </article>
    );
}
