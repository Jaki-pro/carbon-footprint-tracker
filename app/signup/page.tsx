"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LoaderCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
const SignUpPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors },
    }
        = useForm();

    const onSubmit = async () => {
        setIsLoading(true);
        setServerError(null);
        const { name, email, password } = getValues();
        try {

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });
            if (res.ok) {
                router.replace('/dashboard');
            } else {
                const data = await res.json();
                throw new Error(data.error || "Signup failed");
            }
            setIsLoading(false);
        } catch (error) {
            setError("root.serverError", {
                type: "server",
                message: (error as Error).message || "Server error occurred",
            });
        } finally{
            setIsLoading(false);
        }

    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-slate-200 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300">

                {isSuccess ? (
                    // --- Success State ---
                    <div className="text-center">
                        {/* Updated Check Icon */}
                        <Check className="w-16 h-16 mx-auto text-green-500" strokeWidth={3} />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
                            Account Created!
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Welcome aboard! You can now sign in.
                        </p>
                    </div>
                ) : (
                    // --- Form State ---
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                Create Account
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Join us and start your journey.
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
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        {...register("name", {
                                            required: "Name is required",
                                        })}

                                        className={`block w-full rounded-lg border bg-gray-50 p-3 text-sm text-gray-900 transition-all duration-200 ${errors.name
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        aria-invalid={errors.name ? "true" : "false"}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {/*errors.name.message*/}
                                        </p>
                                    )}
                                </div>

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
                                        {...register("email", {
                                            required: "Email is required",
                                        })}

                                        className={`block w-full rounded-lg border bg-gray-50 p-3 text-sm text-gray-900 transition-all duration-200 ${errors.email
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            }`}
                                        aria-invalid={errors.email ? "true" : "false"}
                                        placeholder="name@company.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-red-600">
                                            {/*errors.email.message*/}
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
                                            {...register("password", {
                                                required: "Password is required",
                                            })}

                                            className={`block w-full rounded-lg border bg-gray-50 p-3 pr-10 text-sm text-gray-900 transition-all duration-200 ${errors.password
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
                                            {/*errors.root.serverError.message*/}
                                        </p>
                                    )}
                                </div>

                                {/* --- Submit Button --- */}
                                <Button
                                    type="submit"
                                    className="relative w-full"
                                >
                                    {isLoading && (
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                            {/* Updated Spinner Icon */}
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                        </div>
                                    )}
                                    <span className={isLoading ? 'invisible' : 'visible'}>
                                        Create Account
                                    </span>
                                </Button>
                                <p>Already have an account? <Link className='text-blue-500' href={'/login'}>Login</Link> </p>
                            </fieldset>
                            {errors.root?.serverError && (
                                <p className="mt-4 text-sm text-red-600">{errors.root.serverError.message}</p>
                            )}
                        </form>
                    </>
                )}
            </div>
        </main>
    );
};
export default SignUpPage;