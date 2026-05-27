"use client";

import * as React from "react";
import { toast } from "sonner";
import InventoryMovementForm from "@/components/inventory-movement-form";
import { getCurrentUser } from "@/lib/auth";

interface User {
  id: string;
  role: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
}

async function getUser() {
  const user = await getCurrentUser();
  return user;
}

export default function CreateInventoryMovementPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);

  async function getProducts() {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products.");
        }
        return res;
      });
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  }

  React.useEffect(() => {
    getProducts();
  }, []);

  React.useEffect(() => {
    getUser().then((res) => setUser(res));
  }, []);

  if (user && products.length > 0) {
    return (
      <div>
        <InventoryMovementForm
          movementData={null}
          products={products.map((p) => ({ product: p }))}
          onSubmit={async (value) => {
            try {
              const response = await fetch("/api/movements/product", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  movement: {
                    ...value,
                    createdById: user?.id,
                    updatedById: user.id,
                  },
                }),
              }).then((res) => {
                if (!res.ok) {
                  throw new Error("Failed to create inventory movement.");
                }
                toast.success("Inventory movement created successfully!");
                return res;
              });
              return response;
            } catch (error) {
              toast.error(
                "An error occurred while creating the inventory movement.",
              );
              console.error("Error creating inventory movement:", error);
              return new Response(null, { status: 500 });
            }
          }}
        />
      </div>
    );
  }
}
