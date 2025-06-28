"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Card,
  CardTitle,
  CardAction,
  CardFooter,
  CardContent,
  CardHeader,
} from "../../ui/card";
import { useCallback, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Alert, AlertTitle } from "../../ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { Input } from "../../ui/input";

const formSchema = z
  .object({
    name: z
      .string({ message: "Name is require" })
      .min(4, { message: "min user name is 4 char" }),
    email: z.string({ message: "Email is require" }).email(),
    password: z
      .string({ message: "Password is require" })
      .min(6, { message: "min Password  is 6 char" }),
    confirmPassword: z
      .string()
      .min(6, { message: "min Confirm Password  is 6 char" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setError(null);
    setPending(false);
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess() {
          setPending(false);
          router.push("/sign-in");
        },
        onError(error) {
          setError(error.error.message);
        },
      }
    );
  };
  return (
    <div className=" flex flex-col gap-2">
      <Card className=" overflow-hidden">
        <CardContent className=" grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" p-6 md:p-8"
            >
              <div className=" flex flex-col gap-2">
                <div className=" flex flex-col items-center text-center">
                  <h1 className=" text-2xl font-bold">Welcome back</h1>
                  <p className=" text-muted-foreground text-balance">
                    Login to your account
                  </p>
                </div>
                <div className=" grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" grid gap-3">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className=" bg-destructive/10 border-none">
                    <OctagonAlertIcon className=" h-4 w-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button disabled={pending} type="submit" className=" w-full">
                  Sign up
                </Button>
                <div className=" after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className=" bg-card text-muted-foreground relative z-10 px-2">
                    Or continue With
                  </span>
                </div>
                <div className=" grid grid-cols-2 gap-4">
                  <Button variant={"outline"} type="button">
                    Google
                  </Button>
                  <Button variant={"outline"} type="button">
                    Github
                  </Button>
                </div>
                <div className=" text-center text-sm">
                  have an account ?{" "}
                  <Link
                    href="/sign-in"
                    prefetch={false}
                    replace={true}
                    className=" underline underline-offset-4"
                  >
                    Signin
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className=" bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="logo" className=" h-[92px] w-[92px]" />
            <p className=" text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>
      <div className=" text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:underline-offset-4">
        By clicking continue, you agree to our term{" "}
        <a href="#">Term of Service</a>
      </div>
    </div>
  );
}
