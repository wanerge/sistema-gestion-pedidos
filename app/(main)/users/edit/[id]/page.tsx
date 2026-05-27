"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useParams } from "next/navigation";
import UserForm from "@/components/user-form";

type UserDataResponse = {
  user: {
    name: string;
    email: string;
    password: string;
    image: string;
    role: string;
  };
};

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const [userData, setUser] = React.useState<UserDataResponse | null>(null);

  async function fetchUserData(userId: string) {
    try {
      const response = await fetch(`/api/user?id=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }
      const user = await response.json();
      setUser(user);
      return user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("An error occurred while fetching user data.");
      return null;
    }
  }

  React.useEffect(() => {
    if (params.id) {
      fetchUserData(params.id);
    }
  }, [params.id]);

  return (
    <div>
      <UserForm
        userData={userData}
        onSubmit={async (value) => {
          try {
            const response = await fetch("/api/user", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ user: { ...value, id: params.id } }),
            }).then((res) => {
              if (!res.ok) {
                throw new Error("Failed to update user.");
              }
              toast.success("User updated successfully!");
              setUser({ user: { ...value } });
              return res;
            });
            return response;
          } catch (error) {
            toast.error("An error occurred while updating the user.");
            console.error("Error updating user:", error);
            return new Response(null, { status: 500 });
          }
        }}
      />
    </div>
  );
}
