'use client';

import { apiRequest } from '@/app/lib/api';
import { applyTheme } from '@/app/lib/theme';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await apiRequest('/api/auth/me');
                setFullName(data.full_name);
                setEmail(data.email);
                setPhone(data.phone || '');
                setBio(data.bio || '');
                setTheme(data.theme || 'light');
            } catch (loadError) {
                console.error('Profile loading error:', loadError);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [router]);

    async function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (fullName.trim().length < 2) {
            setError('Name must be at least 2 characters.');
            setMessage('');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const data = await apiRequest('/api/auth/me', {
                method: 'PATCH',
                body: JSON.stringify({
                    full_name: fullName.trim(),
                    phone: phone.trim() || null,
                    bio: bio.trim() || null,
                    theme,
                }),
            });

            setFullName(data.full_name);
            setPhone(data.phone || '');
            setBio(data.bio || '');
            setTheme(data.theme || 'light');
            applyTheme(data.theme || 'light');
            setMessage('Profile saved.');
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : 'Unable to save profile.'
            );
        } finally {
            setSaving(false);
        }
    }

    const initial = (fullName.trim()[0] || '?').toUpperCase();

    return (
        <div>
            <Header />
            <main className='flex'>
                <Sidebar />
                <div className='flex flex-1 flex-col gap-4 p-5'>
                    <div className='flex justify-between w-full items-center'>
                        <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>
                            Profile
                        </h2>
                    </div>

                    <div className='w-full max-w-xl p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <form onSubmit={handleSave} className='flex flex-col gap-4'>
                                <div className='bg-black text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold'>
                                    {initial}
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium text-gray-700'>Name</label>
                                    <input
                                        type='text'
                                        value={fullName}
                                        onChange={(event) => setFullName(event.target.value)}
                                        className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium text-gray-700'>Email</label>
                                    <input
                                        type='email'
                                        value={email}
                                        disabled
                                        className='px-3 py-1 border border-gray-300 rounded-md bg-gray-100'
                                    />
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium text-gray-700'>Phone</label>
                                    <input
                                        type='tel'
                                        value={phone}
                                        onChange={(event) => setPhone(event.target.value)}
                                        className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <label className='text-sm font-medium text-gray-700'>Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={(event) => setBio(event.target.value)}
                                        className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                </div>

                                <fieldset className='flex flex-col gap-2'>
                                    <legend className='text-sm font-medium text-gray-700'>Theme</legend>
                                    <label className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            name='theme'
                                            value='light'
                                            checked={theme === 'light'}
                                            onChange={() => setTheme('light')}
                                        />
                                        Light
                                    </label>
                                    <label className='flex items-center gap-2'>
                                        <input
                                            type='radio'
                                            name='theme'
                                            value='dark'
                                            checked={theme === 'dark'}
                                            onChange={() => setTheme('dark')}
                                        />
                                        Dark
                                    </label>
                                </fieldset>

                                {message && <p className='text-green-600'>{message}</p>}
                                {error && <p className='text-red-600'>{error}</p>}

                                <div className='flex justify-end gap-2'>
                                    <button
                                        type='submit'
                                        disabled={saving}
                                        className='text-white py-1 px-3 bg-black rounded-lg'
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}