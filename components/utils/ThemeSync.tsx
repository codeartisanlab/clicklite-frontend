'use client';

import { apiRequest } from '@/app/lib/api';
import { applyTheme } from '@/app/lib/theme';
import { useEffect } from 'react';

export default function ThemeSync() {
    useEffect(() => {
        async function loadTheme() {
            try {
                const data = await apiRequest('/api/auth/me');
                applyTheme(data.theme || 'light');
            } catch (error) {
                console.error('Theme loading error:', error);
            }
        }

        loadTheme();
    }, []);

    return null;
}