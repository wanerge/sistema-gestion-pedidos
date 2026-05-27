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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const movementTypeOptions = [
  { label: "INPUT", value: "INPUT" },
  { label: "OUTPUT", value: "OUTPUT" },
] as const;

type InventoryMovementDataResponse = {
  movement: {
    type: string;
    quantity: number;
  };
};

type ProductDataResponse = {
  product: {
    id: string;
    name: string;
  };
};

const formSchema = z.object({
  type: z.string().refine((value) => {
    return movementTypeOptions.some((option) => option.value === value);
  }, "Please select a valid movement type."),
  quantity: z
    .number()
    .int("Quantity must be an integer.")
    .min(1, "Quantity must be greater than 0."),
  productId: z.string().trim().nonempty("Product is required."),
});

type InventoryMovementFormProps = Readonly<{
  movementData: InventoryMovementDataResponse | null;
  products: ReadonlyArray<ProductDataResponse>;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<Response>;
}>;

export default function InventoryMovementForm({
  movementData,
  products,
  onSubmit,
}: InventoryMovementFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      type: movementData ? movementData.movement.type : "INPUT",
      quantity: movementData ? movementData.movement.quantity : 0,
      productId: products ? products[0].product.id : "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const result = await onSubmit(value);
        if (result.ok) {
          router.push("/movements/products");
        }
      } catch (error) {
        console.error("Error submitting inventory movement form:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="container mx-auto p-10">
      <div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Movimientos de inventario
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los movimientos de inventario aquí.
          </p>
        </div>
        <div className="my-10 rounded-md border bg-popover py-6 px-8 max-w-2xl">
          <div>
            <form
              id="inventory-movement-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field name="productId">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Product</FieldLabel>
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
                          >
                            <SelectValue>
                              {products.find(
                                (p) => p.product.id === field.state.value,
                              )?.product.name ?? "Select a product"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Products</SelectLabel>
                              {products?.map((item) => (
                                <SelectItem
                                  key={item.product.id}
                                  value={item.product.id}
                                >
                                  {item.product.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="quantity">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value, 10);
                            field.handleChange(Number.isNaN(value) ? 1 : value);
                          }}
                          type="number"
                          min={1}
                          step="1"
                          aria-invalid={isInvalid}
                          placeholder="1"
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="type">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Type</FieldLabel>
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
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Types</SelectLabel>
                              {movementTypeOptions.map((option) => (
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
                <Button type="button" form="inventory-movement-form">
                  <Spinner className="ml-2" />
                  Enviando...
                </Button>
              ) : (
                <Button type="submit" form="inventory-movement-form">
                  Enviar
                </Button>
              )}
            </Field>
          </div>
        </div>
      </div>
      <div className="fixed top-10 right-10">
        <Link href="/movements/products">
          <Button variant="destructive" size="lg">
            Cancelar
          </Button>
        </Link>
      </div>
    </div>
  );
}
