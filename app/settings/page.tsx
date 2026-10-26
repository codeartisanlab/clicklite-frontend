'use client';

import { apiRequest } from '@/app/lib/api';
import { applyTheme } from '@/app/lib/theme';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function Settings() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [theme, setTheme] = useState('light');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingTheme, setSavingTheme] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadSettings() {
            try {
                const data = await apiRequest('/api/auth/me');
                setFullName(data.full_name);
                setEmail(data.email);
                setPhone(data.phone || '');
                setBio(data.bio || '');
                setTheme(data.theme || 'light');
            } catch (loadError) {
                console.error('Settings loading error:', loadError);
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        }

        loadSettings();
    }, [router]);

    async function saveTheme(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSavingTheme(true);
            setError('');
            setMessage('');

            const data = await apiRequest('/api/auth/me', {
                method: 'PATCH',
                body: JSON.stringify({
                    full_name: fullName,
                    phone: phone.trim() || null,
                    bio: bio.trim() || null,
                    theme,
                }),
            });

            setTheme(data.theme || 'light');
            applyTheme(data.theme || 'light');
            setMessage('Settings saved.');
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : 'Unable to save settings.'
            );
        } finally {
            setSavingTheme(false);
        }
    }

    async function savePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSavingPassword(true);
            setError('');
            setMessage('');

            const data = await apiRequest('/api/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            setCurrentPassword('');
            setNewPassword('');
            setMessage(data.message);
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : 'Unable to change password.'
            );
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <div>
            <Header />
            <main className='flex'>
                <Sidebar />
                <div className='flex flex-1 flex-col gap-4 p-5'>
                    <h2 className='text-2xl font-semibold border-b border-gray-200 pb-1'>
                        Settings
                    </h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className='w-full max-w-xl p-4 border border-gray-200 rounded-lg bg-white shadow-xl flex flex-col gap-6'>
                            <section className='flex flex-col gap-2'>
                                <h3 className='font-semibold'>General</h3>
                                <p className='text-sm text-gray-600'>{email}</p>
                            </section>

                            <form onSubmit={saveTheme} className='flex flex-col gap-4'>
                                <section className='flex flex-col gap-2'>
                                    <h3 className='font-semibold'>Appearance</h3>
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
                                </section>

                                <section className='flex flex-col gap-2'>
                                    <h3 className='font-semibold'>Notifications</h3>
                                    <Link href='/notifications' className='text-sm text-blue-600'>
                                        Open notifications
                                    </Link>
                                </section>

                                {message && <p className='text-green-600'>{message}</p>}
                                {error && <p className='text-red-600'>{error}</p>}

                                <div className='flex justify-end'>
                                    <button
                                        type='submit'
                                        disabled={savingTheme}
                                        className='text-white py-1 px-3 bg-black rounded-lg'
                                    >
                                        {savingTheme ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>

                            <form onSubmit={savePassword} className='flex flex-col gap-3 border-t border-gray-200 pt-4'>
                                <h3 className='font-semibold'>Security</h3>
                                <label className='flex flex-col gap-1 text-sm'>
                                    Current password
                                    <input
                                        type='password'
                                        value={currentPassword}
                                        onChange={(event) => setCurrentPassword(event.target.value)}
                                        className='px-3 py-1 border border-gray-300 rounded-md'
                                    />
                                </label>
                                <label className='flex flex-col gap-1 text-sm'>
                                    New password
                                    <input
                                        type='password'
                                        value={newPassword}
                                        onChange={(event) => setNewPassword(event.target.value)}
                                        className='px-3 py-1 border border-gray-300 rounded-md'
                                    />
                                </label>
                                <div className='flex justify-end'>
                                    <button
                                        type='submit'
                                        disabled={savingPassword}
                                        className='text-white py-1 px-3 bg-black rounded-lg'
                                    >
                                        {savingPassword ? 'Saving...' : 'Update password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}