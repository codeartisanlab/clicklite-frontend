'use client';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

export default function Dashboard() {
    const router = useRouter();

    const [user, setUser] = useState<{
        id: string;
        full_name: string;
        email: string;
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [IsModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await apiRequest('/api/auth/me');
                setUser(data);
            } catch (error) {
                console.error('Authentication error:', error);

                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }
  return (
    <div>
        <Header />
        <main className='flex'>
            <Sidebar />
            <div className='flex flex-1 items-center justify-center'>
                <div className='border-gray-200 border flex justify-center items-center flex-col gap-4 w-3xl p-5 shadow-md rounded-md'>
                    <h2 className='text-2xl'>Welcome {user?.full_name}</h2>
                    <p className='text-lg'>No workspace found</p>
                    <button onClick={()=>setIsModalOpen(true)} className='bg-black hover:bg-gray-900 text-white p-2 rounded-lg cursor-pointer'>Create workspace</button>
                </div>
            </div>

            {/* Modal */}
            {IsModalOpen &&
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs'>
                <div className='w-full max-w-md p-4 border border-gray-200 rounded-lg bg-white shadow-xl'>
                    <form className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-medium text-gray-700'>Full Name</label>
                            <input 
                                type='text' 
                                className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-medium text-gray-700'>Detail</label>
                            <textarea 
                                className='px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            ></textarea>
                        </div>
                        <div className='flex justify-end gap-2'>
                            <button type='button' onClick={()=>setIsModalOpen(false)} className='text-black py-1 px-3 bg-gray-300 rounded-lg'>Cancel</button>
                            <button className='text-white py-1 px-3 bg-black rounded-lg'>Save</button>
                        </div>
                    </form>
                </div>
            </div>
            }
        </main>
    </div>
  )
}
