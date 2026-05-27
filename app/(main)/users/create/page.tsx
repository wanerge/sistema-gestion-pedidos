"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import UserForm from "@/components/user-form";

export default function CreateUserPage() {
  return (
    <div>
      <UserForm
        userData={null}
        onSubmit={async (value) => {
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
              return res;
            });
            return response;
          } catch (error) {
            toast.error("An error occurred while creating the user.");
            console.error("Error creating user:", error);
            return new Response(null, { status: 500 });
          }
        }}
      />
    </div>
  );
}
