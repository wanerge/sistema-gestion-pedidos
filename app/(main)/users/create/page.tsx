"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
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

const roleOptions = [
  { label: "USER", value: "USER" },
  { label: "ADMIN", value: "ADMIN" },
] as const;

const formSchema = z.object({
  name: z
    .string()
    .min(3, "User name must be at least 3 characters.")
    .max(32, "User name must be at most 32 characters."),
  email: z
    .email("Please enter a valid email address.")
    .max(100, "Email must be at most 100 characters."),
  image: z.url("Please enter a valid URL."),
  role: z.string().refine((value) => {
    return roleOptions.some((option) => option.value === value);
  }, "Please select a valid role."),
});

export function BugReportForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      image: "",
      role: "USER",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: value }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Failed to create user.");
          }
          toast.success("User created successfully!");
          form.reset();
          return res;
        });
      } catch (error) {
        toast.error("An error occurred while creating the user.");
        console.error("Error creating user:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-sm text-muted-foreground">Manage your users here.</p>
      </div>
      <div className="my-10 rounded-md border bg-popover p-6 max-w-2xl">
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
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
              <form.Field name="image">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Image Url</FieldLabel>
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
                        <FieldLabel htmlFor={field.name}>Role</FieldLabel>

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
                        Select the role of the user. This will determine their
                        permissions and access level in the system.
                      </FieldDescription>
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </div>

        <div>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            {isSubmitting ? (
              <Button type="button" form="bug-report-form">
                <Spinner className="ml-2" />
                Submitting...
              </Button>
            ) : (
              <Button type="submit" form="bug-report-form">
                Submit
              </Button>
            )}
          </Field>
        </div>
      </div>
    </div>
  );
}

export default function CreateUserPage() {
  return (
    <div className="container mx-auto p-10">
      <BugReportForm />
      <div className="fixed top-10 right-10">
        <Link href="/users">
          <Button variant="destructive" size={"lg"}>
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}
