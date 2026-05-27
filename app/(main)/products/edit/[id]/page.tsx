"use client";

import * as React from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import ProductForm from "@/components/product-form";
import { useUser } from "@/hooks/useUser";

type ProductDataResponse = {
  product: {
    name: string;
    description: string;
    price: number;
    stock: number;
  };
};

export default function EditProductPage() {
  const { user } = useUser();
  const params = useParams<{ id: string }>();
  const [productData, setProduct] = React.useState<ProductDataResponse | null>(
    null,
  );

  async function fetchProductData(productId: string) {
    try {
      const response = await fetch(`/api/product?id=${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product data.");
      }
      const product = await response.json();
      setProduct(product);
      return product;
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("An error occurred while fetching product data.");
      return null;
    }
  }

  React.useEffect(() => {
    if (params.id) {
      fetchProductData(params.id);
    }
  }, [params.id]);

  return (
    <div>
      <ProductForm
        productData={productData}
        onSubmit={async (value) => {
          try {
            const response = await fetch("/api/product", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product: { ...value, id: params.id, updatedById: user.id },
              }),
            }).then((res) => {
              if (!res.ok) {
                throw new Error("Failed to update product.");
              }
              toast.success("Product updated successfully!");
              setProduct({ product: { ...value } });
              return res;
            });
            return response;
          } catch (error) {
            toast.error("An error occurred while updating the product.");
            console.error("Error updating product:", error);
            return new Response(null, { status: 500 });
          }
        }}
      />
    </div>
  );
}
