function priorityLabel(priority: string) {
    if (priority === 'high') {
        return 'High';
    }

    if (priority === 'low') {
        return 'Low';
    }

    return 'Medium';
}

function priorityClass(priority: string) {
    if (priority === 'high') {
        return 'text-red-600';
    }

    if (priority === 'low') {
        return 'text-green-700';
    }

    return 'text-orange-600';
}

export default function PriorityBadge({ priority }: { priority: string }) {
    return (
        <div className={`text-xs ${priorityClass(priority)}`}>
            {priorityLabel(priority)}
        </div>
    );
}
