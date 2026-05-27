"use client";

import * as React from "react";
import { toast } from "sonner";
import ProductForm from "@/components/product-form";
import { getCurrentUser } from "@/lib/auth";

interface User {
  id: string;
  role: string;
  email: string;
}

async function getUser() {
  const user = await getCurrentUser();
  return user;
}

export default function CreateProductPage() {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    getUser().then((res) => setUser(res));
  }, []);

  if (user) {
    return (
      <div>
        <ProductForm
          productData={null}
          onSubmit={async (value) => {
            try {
              const response = await fetch("/api/product", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  product: {
                    ...value,
                    createdById: user.id,
                    updatedById: user.id,
                  },
                }),
              }).then((res) => {
                if (!res.ok) {
                  throw new Error("Failed to create product.");
                }
                toast.success("Product created successfully!");
                return res;
              });
              return response;
            } catch (error) {
              toast.error("An error occurred while creating the product.");
              console.error("Error creating product:", error);
              return new Response(null, { status: 500 });
            }
          }}
        />
      </div>
    );
  }
}
