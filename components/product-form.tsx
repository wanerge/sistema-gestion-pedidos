"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

type ProductDataResponse = {
  product: {
    name: string;
    description: string;
    price: number;
    stock: number;
  };
};

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters.")
    .max(64, "Product name must be at most 64 characters."),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters.")
    .max(255, "Description must be at most 255 characters."),
  price: z.number().min(0, "Price must be greater than or equal to 0."),
  stock: z
    .number()
    .int("Stock must be an integer.")
    .min(0, "Stock must be greater than or equal to 0."),
});

type ProductFormProps = Readonly<{
  productData: ProductDataResponse | null;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<Response>;
}>;

export default function ProductForm({
  productData,
  onSubmit,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: productData ? productData.product.name : "",
      description: productData ? productData.product.description : "",
      price: productData ? productData.product.price : 0,
      stock: productData ? productData.product.stock : 0,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const result = await onSubmit(value);
        if (result.ok) {
          router.push("/products");
        }
      } catch (error) {
        console.error("Error submitting product form:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto p-10">
      <div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tus productos aquí.
          </p>
        </div>
        <div className="my-10 rounded-md border bg-popover py-6 px-8 max-w-2xl">
          <div>
            <form
              id="product-form"
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
                          Nombre del producto
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Laptop"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="description">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Descripcion
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Laptop para oficina"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="price">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Precio</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            field.handleChange(Number.isNaN(value) ? 0 : value);
                          }}
                          type="number"
                          min={0}
                          step="0.01"
                          aria-invalid={isInvalid}
                          placeholder="0.00"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="stock">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Stock</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value, 10);
                            field.handleChange(Number.isNaN(value) ? 0 : value);
                          }}
                          type="number"
                          min={0}
                          step="1"
                          aria-invalid={isInvalid}
                          placeholder="0"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
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
                <Button type="button" form="product-form">
                  <Spinner className="ml-2" />
                  Enviando...
                </Button>
              ) : (
                <Button type="submit" form="product-form">
                  Enviar
                </Button>
              )}
            </Field>
          </div>
        </div>
      </div>
      <div className="fixed top-10 right-10">
        <Link href="/products">
          <Button variant="destructive" size="lg">
            Cancelar
          </Button>
        </Link>
      </div>
    </div>
  );
}
