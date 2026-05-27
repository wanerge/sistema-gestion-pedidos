"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const roleOptions = [
  { label: "USER", value: "USER" },
  { label: "ADMIN", value: "ADMIN" },
] as const;

type UserDataResponse = {
  user: {
    name: string;
    email: string;
    password: string;
    image: string;
    role: string;
  };
};

const formSchema = z.object({
  name: z
    .string()
    .min(3, "User name must be at least 3 characters.")
    .max(32, "User name must be at most 32 characters."),
  email: z
    .email("Please enter a valid email address.")
    .max(100, "Email must be at most 100 characters."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters."),
  image: z.string(),
  role: z.string().refine((value) => {
    return roleOptions.some((option) => option.value === value);
  }, "Please select a valid role."),
});

type UserFormProps = Readonly<{
  userData: UserDataResponse | null;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<Response>;
}>;

export default function UserForm({ userData, onSubmit }: UserFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: userData ? userData.user.name : "",
      email: userData ? userData.user.email : "",
      password: userData ? userData.user.password : "",
      image: userData ? userData.user.image : "",
      role: userData ? userData.user.role : "USER",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const result = await onSubmit(value);
        if (result.ok) {
          router.push("/users");
        }
      } catch (error) {
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto p-10">
      <div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tus usuarios aquí.
          </p>
        </div>
        <div className="my-10 rounded-md border bg-popover py-6 px-8 max-w-2xl">
          <div>
            <form
              id="bug-report-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Nombre del usuario
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="John Doe"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="email">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Correo Electrónico
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="email"
                          aria-invalid={isInvalid}
                          placeholder="john.doe@example.com"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="flex items-center">
                          <FieldLabel htmlFor={field.name}>
                            Contraseña
                          </FieldLabel>
                        </div>

                        <div className="relative flex flex-row">
                          <div className="w-full">
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              type={showPassword ? "text" : "password"}
                              aria-invalid={isInvalid}
                              placeholder="Enter your password"
                              required
                            />
                          </div>

                          <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon
                                icon={showPassword ? "mdi:eye" : "mdi:eye-off"}
                              />
                            </Button>
                          </div>
                        </div>

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="image">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          URL de la Imagen
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="https://github.com/shadcn.png"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
                <form.Field name="role">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field orientation="vertical" data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>Rol</FieldLabel>

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(value ?? field.state.value)
                          }
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                            className="min-w-30"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Roles</SelectLabel>
                              {roleOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldDescription>
                          Seleccione el rol del usuario. Esto determinará sus
                          permisos y nivel de acceso en el sistema.
                        </FieldDescription>
                      </Field>
                    );
                  }}
                </form.Field>
              </FieldGroup>
            </form>
          </div>

          <div className="mt-4">
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reiniciar formulario
              </Button>
              {isSubmitting ? (
                <Button type="button" form="bug-report-form">
                  <Spinner className="ml-2" />
                  Enviando...
                </Button>
              ) : (
                <Button type="submit" form="bug-report-form">
                  Enviar
                </Button>
              )}
            </Field>
          </div>
        </div>
      </div>
      <div className="fixed top-10 right-10">
        <Link href="/users">
          <Button variant="destructive" size={"lg"}>
            Cancelar
          </Button>
        </Link>
      </div>
    </div>
  );
}
