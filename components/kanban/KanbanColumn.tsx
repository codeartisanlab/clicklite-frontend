import TaskCard from './TaskCard';

type Task = {
    id: string;
    title: string;
    priority: string;
    assignee: string | null;
};

type KanbanColumnProps = {
    projectId: string;
    title: string;
    status: string;
    tasks: Task[];
    onMove: (taskId: string, status: string) => void;
};

export default function KanbanColumn({
    projectId,
    title,
    status,
    tasks,
    onMove,
}: KanbanColumnProps) {
    function handleDragOver(event: React.DragEvent<HTMLElement>) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(event: React.DragEvent<HTMLElement>) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');

        if (taskId) {
            onMove(taskId, status);
        }
    }

    return (
        <section
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className='p-3 border-gray-200 border rounded-md min-h-40'
        >
            <h3 className='text-center text-md border-b pb-1 border-gray-200'>
                {title}
            </h3>
            <div className='flex flex-col gap-3 my-3'>
                {tasks.length === 0 ? (
                    <p className='text-center text-sm text-gray-500'>No tasks</p>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            projectId={projectId}
                            task={task}
                        />
                    ))
                )}
            </div>
        </section>
    );
}