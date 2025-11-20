/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// Import icons from lucide-react
import { Eye, EyeOff, LoaderCircle, Check } from 'lucide-react'; 
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
 
type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  // --- Component State ---
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  // --- React Hook Form ---
  const {
    register,
    handleSubmit,
    getValues, 
    formState: { errors },
  } = useForm<LoginFormData>();

  // --- Form Submission Handler ---
  const onSubmit = async () => {
    setIsLoading(true);
    setServerError(null);
    const { email, password } = getValues();
    console.log(email, password); 
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    if (res?.error) setError(res.error);
    // Simulate a 2-second API call
    else {console.log('ok'); router.push("/dashboard");}
    
    // Simulate a successful login
    setIsLoading(false);
    setIsSuccess(true);
    
    // --- Simulate an API Error (Example) ---
    // try {
    //   // ... API cal
    //   if (!response.ok) throw new Error('Invalid email or password.');
    //   setIsSuccess(true);
    // } catch (error) {
    //   setServerError(error instanceof Error ? error.message : 'An unknown error occurred.');
    // } finally {
    //   setIsLoading(false);
    // }
  };
  
  return (
    <main className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-md  rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300">
        
        {isSuccess ? ( 
          <div className="text-center">
            <Check className="w-16 h-16 mx-auto text-green-500" strokeWidth={3} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
              Login Successful!
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Redirecting you now...
            </p>
          </div>
        ) : ( 
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome Back
              </h1>
              <p className="text-gray-600 mt-2">
                Sign in to continue to your account.
              </p>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg p-3 mb-4" role="alert">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <fieldset disabled={isLoading} className="space-y-6">
                 
                <div>
                  <label 
                    htmlFor="email" 
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`block w-full rounded-lg border bg-gray-50 p-3 text-sm text-gray-900 transition-all duration-200 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    aria-invalid={errors.email ? "true" : "false"}
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
 
                <div>
                  <label 
                    htmlFor="password" 
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { 
                        required: "Password is required" 
                      })}
                      className={`block w-full rounded-lg border bg-gray-50 p-3 pr-10 text-sm text-gray-900 transition-all duration-200 ${
                        errors.password
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      aria-invalid={errors.password ? "true" : "false"}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 rounded-lg focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
 
                <button
                  type="submit"
                  className="relative w-full rounded-lg bg-[#046307] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#034f06] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                  <span className={isLoading ? 'invisible' : 'visible'}>
                    Sign In
                  </span>
                </button>
              </fieldset>
            </form>
          </>
        )}
      </div>
    </main>
  );
};

export default LoginPage;