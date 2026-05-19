'use client'

import { authClient } from '@/lib/auth-client';
import { Check } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { GrGoogle } from 'react-icons/gr';
import { toast } from "react-toastify";

const LoginPage = () => {

    const { register, handleSubmit,formState:{errors} } = useForm()


const handleLoginFunc = async (data) => {
  const { data: res, error } = await authClient.signIn.email({
    email: data.email,
    password: data.password,
    rememberMe: true,
    callbackURL: "/",
  });

  if (error) {
    toast.error(error.message || "Login failed");
  }

  if (res) {
    toast.success("Login successful 🎉");
  }
};
 
    

const handlGoogleSignIn = async () => {
  // show toast BEFORE redirect
  toast.loading("Redirecting to Google...");

  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};
   

    return (
        <div className='container mx-auto bg-[#C9A227] h-[60vh] flex justify-center items-center mt-15'>
            <div className='p-4 rounded-xl bg-[#C9A227]'>
                <h2 className='text-3xl  text-center font-bold mb-5'>Login your account</h2>
                <form onSubmit={handleSubmit(handleLoginFunc)}>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">

                        <label className="label">Email</label>
                        <input type="email" className="input"
                            placeholder="Email"
                            {...register("email",{required: "Email is required"})} />
                            {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}

                        <label className="label">Password</label>
                        <input type="password" className="input"
                            placeholder="Password"
                            {...register("password",{required: "Password is required"})} />

                            {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}

                    </fieldset>
                    
                     <div className="flex gap-2 mt-4">
          <button type="submit" className='btn btn-neutral'>
            <Check />
            Submit
          </button>
          <button type="reset" className='btn btn-neutral'>
            Reset
          </button>
        </div>
                </form>
                <p className="text-center">Or</p>

      <button onClick={handlGoogleSignIn}  className="btn btn-neutral"><GrGoogle/> Sign In With Google</button>
    
                <p className='mt-5'>Don't have an account? <Link href={"/register"} className='text-blue-700'>Register</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;