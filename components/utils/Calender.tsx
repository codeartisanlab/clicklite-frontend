'use client';

import FullCalendar from '@fullcalendar/react';
import themePlugin from '@fullcalendar/react/themes/monarch';
import dayGridPlugin from '@fullcalendar/react/daygrid';

import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/monarch/theme.css';
import '@fullcalendar/react/themes/monarch/palettes/purple.css';

type CalendarTask = {
    id: string;
    title: string;
    due_date: string;
    status: string;
    project_id: string;
    project_name: string;
};

function eventColor(status: string) {
    if (status === 'done') {
        return '#16a34a';
    }

    if (status === 'in_progress') {
        return '#ea580c';
    }

    return '#2563eb';
}

export default function Calendar({ tasks }: { tasks: CalendarTask[] }) {
    const events = tasks.map((task) => ({
        title: `${task.title} (${task.project_name})`,
        date: task.due_date,
        url: `/projects/${task.project_id}/tasks/${task.id}`,
        color: eventColor(task.status),
    }));

    return (
        <FullCalendar
            plugins={[themePlugin, dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
        />
    );
}