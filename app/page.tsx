import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="bg-black text-white rounded-xs w-8 h-8 flex items-center justify-center font-bold">
                        C
                    </div>
                    <span className="font-bold text-2xl">ClickLite</span>
                </div>
                <nav className="flex items-center gap-6">
                    <Link href="/auth/login">Login</Link>
                    <Link
                        href="/auth/register"
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Register
                    </Link>
                </nav>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-5xl font-bold">Organize Work. Ship Faster.</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Simple project management for individuals and teams.
                </p>
                <Link
                    href="/auth/register"
                    className="mt-8 bg-black text-white px-6 py-3 rounded-lg"
                >
                    Get Started
                </Link>

                <div className="mt-16 grid gap-6 md:grid-cols-3 w-full max-w-4xl text-left">
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h2 className="font-bold text-xl">Projects</h2>
                        <p className="mt-2 text-gray-600">
                            Group work into projects inside a workspace.
                        </p>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h2 className="font-bold text-xl">Tasks</h2>
                        <p className="mt-2 text-gray-600">
                            Track status, priority, and due dates.
                        </p>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-6">
                        <h2 className="font-bold text-xl">Teamwork</h2>
                        <p className="mt-2 text-gray-600">
                            Invite people into a workspace.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="text-center text-gray-500 py-6 border-t border-gray-200">
                ClickLite
            </footer>
        </div>
    );
}