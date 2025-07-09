'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', json.access_token);
      localStorage.setItem('role', json.role);

      if (json.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Logging In...
                </span>
              ) : (
                'Login'
              )}
            </Button>

            {/* ✅ New Registration Button */}
            <p className="mt-6 text-sm text-muted-foreground text-center">
            New here?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 underline cursor-pointer"
            >
              Register
            </span>
          </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
