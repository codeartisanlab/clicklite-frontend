import Link from "next/link";

export default function Login(){
    return (
        <div className="mx-auto mt-10 px-5 py-8 border-2 border-gray-100 rounded-2xl shadow-md w-100">
            <div className="signup-heading text-center mb-8">
                <h1 className="text-2xl">ClickLite</h1>
                <h2 className="text-md text-gray-600">Sign in to your account</h2>
            </div>

            <div className="signup-form">
                <form className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label>Email</label>
                        <input type="email" className="border border-blue-300 rounded-md p-1" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Password</label>
                        <input type="password" className="border border-blue-300 rounded-md p-1" />
                    </div>
                    <div className="mt-3 text-center">
                        <button type="button" className="bg-blue-500 py-2 px-1 w-full rounded-md text-white hover:bg-blue-600">Submit</button>
                    </div>
                    <div className="text-center">
                        <p>Don't have an account? <Link href="/auth/register">Signup</Link></p>
                    </div>
                </form>
            </div>

        </div>
    );
}