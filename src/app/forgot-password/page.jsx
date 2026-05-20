'use client'

import { authClient } from '@/lib/auth-client';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";

const ForgotPasswordPage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleResetFunc = async (data) => {
        const { email } = data;
        const { data: res, error } = await authClient.forgetPassword({
            email,
            redirectTo: "/reset-password",
        });

        if (error) {
            toast.error(error.message || "Failed to send reset link");
        } else {
            toast.success("Password reset email sent! Check your inbox 📧");
        }
    };

    return (
        <div className='min-h-[85vh] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-300'>
            <div className='w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl dark:bg-slate-900/80 dark:border-blue-500/30 dark:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all duration-300'>
                <h2 className='text-3xl text-center font-extrabold tracking-tight text-white mb-3'>
                    Forgot Password
                </h2>
                <p className='text-center text-sm text-white/70 dark:text-blue-200/60 mb-6'>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit(handleResetFunc)} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="text-white/95 dark:text-blue-200/90 text-sm font-semibold tracking-wide mb-1.5 block">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white focus:bg-white/25 dark:bg-blue-950/20 dark:border-blue-800/40 dark:text-blue-100 dark:placeholder-blue-300/30 dark:focus:ring-blue-500/40 dark:focus:border-blue-400 dark:focus:bg-blue-950/40 transition-all duration-200"
                                placeholder="name@example.com"
                                {...register("email", { required: "Email address is required" })} 
                            />
                            {errors.email && (
                                <p className='text-rose-200 dark:text-rose-400 text-xs mt-1 font-medium'>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 mt-6'>
                        {/* Primary Action Button */}
                        <button 
                            type="submit" 
                            className="w-full py-3 px-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-md cursor-pointer flex justify-center items-center gap-2 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700/80 dark:border-blue-500/20"
                        >
                            <Mail className="w-5 h-5" />
                            Send Reset Link
                        </button>

                        {/* Reset and Login Button Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                type="button" 
                                onClick={() => reset()} 
                                className="py-2.5 px-4 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer flex justify-center items-center gap-2 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700/80 dark:border-blue-500/20 shadow-md"
                            >
                                Reset
                            </button>
                            <Link 
                                href="/login" 
                                className="py-2.5 px-4 rounded-xl font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-center cursor-pointer flex justify-center items-center gap-2 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700/80 dark:border-blue-500/20 shadow-md"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
