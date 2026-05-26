'use client'

import { authClient } from '@/lib/auth-client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { GrGoogle } from 'react-icons/gr';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from 'next/link';

const RegisterPage = () => {
    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleRegisterFunc = async (data) => {
        const { name, email, photo, password } = data;

        const { data: res, error } = await authClient.signUp.email({
            name,
            email,
            password,
            image: photo,
            callbackURL: "/",
        });

        if (error) {
            // alert(error.message);
            toast(error.message);
        }

        if (res) {
            toast("Sign-up successful");
            
            router.push("/");
        }
    };

    const handlGoogleSignIn = async () => {
        try {
            const data = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            toast.success("Login successful 🎉");

        } catch (error) {
            toast.error("Google sign-in failed ❌");
        }
    };

    return (
        <div className='min-h-[85vh] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-300'>
            <div className='w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl dark:bg-slate-900/80 dark:border-blue-500/30 dark:shadow-[0_0_50px_rgba(59,130,246,0.2)] transition-all duration-300'>
                <h2 className='text-3xl text-center font-extrabold tracking-tight text-white mb-6'>
                    Register your account
                </h2>
                
                <form onSubmit={handleSubmit(handleRegisterFunc)} className="space-y-5">
                    <div className="space-y-4">
                        <div>
                            <label className="text-white/95 dark:text-blue-200/90 text-sm font-semibold tracking-wide mb-1.5 block">
                                Name
                            </label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white focus:bg-white/25 dark:bg-blue-950/20 dark:border-blue-800/40 dark:text-blue-100 dark:placeholder-blue-300/30 dark:focus:ring-blue-500/40 dark:focus:border-blue-400 dark:focus:bg-blue-950/40 transition-all duration-200"
                                placeholder="Type here name"
                                {...register("name", { required: "Name is required" })} 
                            />
                            {errors.name && (
                                <p className='text-rose-200 dark:text-rose-400 text-xs mt-1 font-medium'>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-white/95 dark:text-blue-200/90 text-sm font-semibold tracking-wide mb-1.5 block">
                                Photo URL
                            </label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white focus:bg-white/25 dark:bg-blue-950/20 dark:border-blue-800/40 dark:text-blue-100 dark:placeholder-blue-300/30 dark:focus:ring-blue-500/40 dark:focus:border-blue-400 dark:focus:bg-blue-950/40 transition-all duration-200"
                                placeholder="Type here photo URL"
                                {...register("photo", { required: "Photo URL is required" })} 
                            />
                            {errors.photo && (
                                <p className='text-rose-200 dark:text-rose-400 text-xs mt-1 font-medium'>
                                    {errors.photo.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-white/95 dark:text-blue-200/90 text-sm font-semibold tracking-wide mb-1.5 block">
                                Email
                            </label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white focus:bg-white/25 dark:bg-blue-950/20 dark:border-blue-800/40 dark:text-blue-100 dark:placeholder-blue-300/30 dark:focus:ring-blue-500/40 dark:focus:border-blue-400 dark:focus:bg-blue-950/40 transition-all duration-200"
                                placeholder="Email"
                                {...register("email", { required: "Email is required" })} 
                            />
                            {errors.email && (
                                <p className='text-rose-200 dark:text-rose-400 text-xs mt-1 font-medium'>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-white/95 dark:text-blue-200/90 text-sm font-semibold tracking-wide mb-1.5 block">
                                Password
                            </label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-3 bg-white/15 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white focus:bg-white/25 dark:bg-blue-950/20 dark:border-blue-800/40 dark:text-blue-100 dark:placeholder-blue-300/30 dark:focus:ring-blue-500/40 dark:focus:border-blue-400 dark:focus:bg-blue-950/40 transition-all duration-200"
                                placeholder="Password"
                                {...register("password", { 
                                    required: "Password is required",
                                    validate: {
                                        hasUpperCase: (value) => 
                                            /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                        hasLowerCase: (value) => 
                                            /[a-z]/.test(value) || "Password must contain at least one lowercase letter"
                                    }
                                })} 
                            />
                            {errors.password && (
                                <p className='text-rose-200 dark:text-rose-400 text-xs mt-1 font-medium'>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 mt-6'>
                        {/* Primary Register Button */}
                        <button 
                            type="submit" 
                            className="w-full py-3 px-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-md cursor-pointer flex justify-center items-center gap-2 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700/80 dark:border-blue-500/20"
                        >
                            Register
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
                                Login
                            </Link>
                        </div>

                        {/* Google Sign In */}
                        <button 
                            type="button" 
                            onClick={handlGoogleSignIn}  
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-lg dark:bg-slate-800 dark:border-blue-500/20 dark:text-white dark:hover:bg-slate-700"
                        >
                            <GrGoogle className="text-lg" /> Sign In With Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;