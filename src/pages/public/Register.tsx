import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerApi } from "@/apis/auth";
import type { registerRequest } from "@/schemas/auth.schema";
import { RegisterSchema } from "@/schemas/auth.schema";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<registerRequest>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: registerRequest) => {
    setError(null);
    setLoading(true);
    try {
      await registerApi(values);
      console.log("Registration successful");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Register failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center justify-center px-4 py-10">
      <div className="w-full rounded-lg border border-white/10 bg-neutral-900 p-6 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign up</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input type="string" placeholder="Enter avatar URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? (
              <div className="text-sm text-red-400">Tên đăng nhập hoặc email đã tồn tại trên hệ thống</div>
            ) : null}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}


