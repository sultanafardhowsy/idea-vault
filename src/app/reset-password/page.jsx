'use client'

import { authClient } from '@/lib/auth-client';
import { KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";

const inputClass = "w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white focus:bg-white/25 dark:bg-blue-950/20 dark:border-blue-800/40 dark:text-blue-100 dark:placeholder-blue-300/30 dark:focus:ring-blue-500/40 dark:focus:border-blue-400 dark:focus:bg-blue-950/40 transition-all duration-200";
const labelClass = "text-white/95 dark:text-blue-200/90 text-sm font-semibold tracking-wide mb-1.5 block";
const errorClass = "text-rose-200 dark:text-rose-400 text-xs mt-1 font-medium";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const linkError = searchParams.get('error');
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

    const handleReset = async ({ newPassword }) => {
        const { error } = await authClient.resetPassword({ newPassword, token });
        if (error) {
            toast.error(error.message || "Failed to reset password");
            return;
        }
        toast.success("Password updated. Please log in.");
        router.push('/login');
    };

    if (!token || linkError) {
        return (
            <p className='text-center text-sm text-white/80 dark:text-blue-200/70'>
                This reset link is invalid or has expired.{' '}
                <Link href="/forgot-password" className="underline font-semibold">Request a new one</Link>.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit(handleReset)} className="space-y-5">
            <div>
                <label className={labelClass}>New Password</label>
                <input
                    type="password"
                    className={inputClass}
                    placeholder="At least 8 characters"
                    {...register("newPassword", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                    })}
                />
                {errors.newPassword && <p className={errorClass}>{errors.newPassword.message}</p>}
            </div>
            <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                    type="password"
                    className={inputClass}
                    {...register("confirmPassword", {
                        validate: (v) => v === watch("newPassword") || "Passwords do not match",
                    })}
                />
                {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 shadow-md cursor-pointer flex justify-center items-center gap-2 disabled:opacity-60 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700/80 dark:border-blue-500/20"
            >
                <KeyRound className="w-5 h-5" />
                {isSubmitting ? "Updating..." : "Set New Password"}
            </button>
        </form>
    );
}

const ResetPasswordPage = () => (
    <div className='min-h-[85vh] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-300'>
        <div className='w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl dark:bg-slate-900/80 dark:border-blue-500/30 transition-all duration-300'>
            <h2 className='text-3xl text-center font-extrabold tracking-tight text-white mb-6'>
                Reset Password
            </h2>
            <Suspense fallback={null}>
                <ResetPasswordForm />
            </Suspense>
            <Link href="/login" className="mt-6 flex justify-center items-center gap-2 text-sm text-white/80 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
            </Link>
        </div>
    </div>
);

export default ResetPasswordPage;
