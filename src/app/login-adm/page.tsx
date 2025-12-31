"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(1, { message: "Senha é obrigatória" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginAdmPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // const form = useForm<LoginValues>({
    //     resolver: zodResolver(loginSchema),
    //     defaultValues: {
    //         email: "",
    //         password: "",
    //     },
    // });
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "adm@bussola365.com.br",
            password: "aDm@123",
        },
    });

    async function onSubmit(values: LoginValues) {
        setLoading(true);
        const { data, error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/adm/dashboard",
        });

        if (error) {
            toast.error(error.message || "Erro ao fazer login");
            setLoading(false);
        } else {
            toast.success("Login realizado com sucesso");
            router.push("/adm/dashboard");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-prussian-blue-950 px-4">
            <Card className="w-full max-w-md border-prussian-blue-800 bg-prussian-blue-900 text-platinum-50 shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-jungle-green-400">
                        Admin Login
                    </CardTitle>
                    <CardDescription className="text-iron-grey-300">
                        Entre com suas credenciais de administrador
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-iron-grey-100">E-mail</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="admin@bussola365.com"
                                                className="border-prussian-blue-700 bg-prussian-blue-950 text-platinum-50 focus:border-jungle-green-500"
                                                {...field}
                                            />
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
                                        <FormLabel className="text-iron-grey-100">Senha</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="border-prussian-blue-700 bg-prussian-blue-950 text-platinum-50 focus:border-jungle-green-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-jungle-green-600 hover:bg-jungle-green-500 text-prussian-blue-950 font-bold transition-all"
                                disabled={loading}
                            >
                                {loading ? "Entrando..." : "Entrar"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
