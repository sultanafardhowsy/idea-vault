'use client'

import { authClient } from '@/lib/auth-client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { GrGoogle } from 'react-icons/gr';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const RegisterPage = () => {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const handleRegisterFunc = async (data) => {
        const { name, email, photo, password } = data;

        const { data: res, error } = await authClient.signUp.email({
            name,
            email,
            password,
            image: photo,
            callbackURL: "/login",
        });

        if (error) {
            // alert(error.message);
            toast(error.message);
        }

        if (res) {
            toast("Sign-up successful");
            await authClient.signOut();

      toast.success("Logged out successfully 👋");
            router.push("/login");
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
        <div className='container mx-auto bg-[#C9A227] h-[80vh] flex justify-center items-center px-4 mt-10'>
            <div className='p-4 rounded-xl bg-white'>
                <h2 className='text-3xl  text-center font-bold mb-5'>Register your account</h2>
                <form onSubmit={handleSubmit(handleRegisterFunc)}>

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">

                        <label className="label">Name</label>
                        <input type="text" className="input"
                            placeholder="type here name"
                            {...register("name", { required: "Name is required" })} />
                        {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}

                        <label className="label">Photo url</label>
                        <input type="text" className="input"
                            placeholder="type here photo url"
                            {...register("photo", { required: "Photo url is required" })} />

                        {errors.photo && <p className='text-red-500 text-sm'>{errors.photo.message}</p>}

                    </fieldset>
                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">

                        <label className="label">Email</label>
                        <input type="email" className="input"
                            placeholder="Email"
                            {...register("email", { required: "Email is required" })} />
                        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}

                        <label className="label">Password</label>
                        <input type="password" className="input"
                            placeholder="Password"
                            {...register("password", { required: "Password is required" })} />

                        {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}

                    </fieldset>
                    <div className='flex justify-evenly items-center'>
                        <button className="btn btn-neutral mt-4">Register</button>
                        <button onClick={handlGoogleSignIn}  className="btn btn-neutral mt-3"><GrGoogle /> Sign In With Google</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default RegisterPage;