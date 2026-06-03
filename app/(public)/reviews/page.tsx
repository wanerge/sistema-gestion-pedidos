"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  rating: z
    .number()
    .min(1, "Selecciona al menos una estrella.")
    .max(5, "La valoración máxima es 5 estrellas."),
  text: z
    .string()
    .min(10, "Cuéntanos un poco más sobre tu experiencia.")
    .max(500, "El comentario no puede superar los 500 caracteres."),
  name: z
    .string()
    .min(2, "Escribe tu nombre para identificar la reseña.")
    .max(64, "El nombre no puede superar los 64 caracteres."),
  pet: z
    .string()
    .min(2, "Indica qué mascota tienes.")
    .max(64, "El nombre de la mascota es demasiado largo."),
  location: z
    .string()
    .min(2, "Indica tu ciudad o zona.")
    .max(64, "La ciudad no puede superar los 64 caracteres."),
});

const ratingOptions = [
  { value: 1, label: "1 estrella", hint: "Muy mejorable" },
  { value: 2, label: "2 estrellas", hint: "Cumple lo justo" },
  { value: 3, label: "3 estrellas", hint: "Correcto" },
  { value: 4, label: "4 estrellas", hint: "Muy bueno" },
  { value: 5, label: "5 estrellas", hint: "Excelente" },
] as const;

type RateUsFormProps = Readonly<{
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<Response>;
}>;

export default function ReviewsForm({ onSubmit }: RateUsFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<z.infer<
    typeof formSchema
  > | null>(null);

  const form = useForm({
    defaultValues: {
      rating: 0,
      text: "",
      name: "",
      pet: "",
      location: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const result = await fetch("api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: value.rating,
            text: value.text,
            name: value.name,
            pet: value.pet,
            location: value.location,
          }),
        });
        if (result.ok) {
          setSubmittedData(value);
          setSubmitted(true);
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (submitted && submittedData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-amber-50 via-white to-orange-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-4xl">
            🐾
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              ¡Gracias, {submittedData.name.trim()}!
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Tu reseña fue enviada exitosamente. Nos ayuda a mejorar cada día
              la experiencia para ti y tu{" "}
              <span className="font-medium text-slate-800">
                {submittedData.pet.trim()}.
              </span>
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < submittedData.rating ? "text-amber-400" : "text-slate-200"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm italic leading-6 text-slate-600">
              &ldquo;{submittedData.text.trim()}&rdquo;
            </p>
            <p className="mt-3 text-xs text-slate-400">
              {submittedData.name.trim()} · {submittedData.pet.trim()} ·{" "}
              {submittedData.location.trim()}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button variant="black" size="xlg" className="w-full sm:w-auto">
                Volver al inicio
              </Button>
            </Link>
            <Button
              variant="outline"
              size="xlg"
              className="w-full sm:w-auto"
              onClick={() => {
                form.reset();
                setSubmitted(false);
                setSubmittedData(null);
              }}
            >
              Enviar otra reseña
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-white to-orange-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 space-y-1">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Cuéntanos cómo fue tu experiencia
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Tu opinión ayuda a otros dueños de mascotas a tomar mejores
            decisiones.
          </p>
        </div>

        <div className="rounded-[2rem] border border-amber-100 bg-white/90 p-4 shadow-[0_18px_60px_rgba(120,53,15,0.10)] backdrop-blur sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-4 rounded-3xl bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-4 text-white">
            <span className="text-3xl" aria-hidden="true">
              🌟
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
                Reseña de cliente
              </p>
              <h2 className="mt-0.5 text-lg font-bold sm:text-xl">
                Tu opinión mejora la tienda para todos
              </h2>
            </div>
          </div>

          <form
            id="rate-us-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="rating">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const currentHint = ratingOptions.find(
                    (o) => o.value === field.state.value,
                  )?.hint;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Valoración</FieldLabel>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {ratingOptions.map((option) => {
                            const active = field.state.value === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => field.handleChange(option.value)}
                                onBlur={field.handleBlur}
                                className={[
                                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                                  active
                                    ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                                    : "border-amber-100 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50",
                                ].join(" ")}
                                aria-pressed={active}
                              >
                                <span aria-hidden="true">★</span>
                                <span>{option.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {currentHint && (
                          <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm">
                            <span className="font-medium text-slate-900">
                              {currentHint}
                            </span>
                            <span className="ml-auto text-slate-400">
                              {field.state.value} / 5
                            </span>
                          </div>
                        )}
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="text">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Comentario</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Cuéntanos qué te gustó, qué podría mejorar y cómo fue tu compra..."
                        className="min-h-32"
                      />
                      <FieldDescription>
                        Puedes mencionar rapidez, atención, calidad del producto
                        o facilidad de compra.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <div className="grid gap-5 lg:grid-cols-2">
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Tu nombre"
                          autoComplete="name"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="pet">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Mascota</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Perro, gato, ave..."
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="location">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Ciudad</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Ciudad, barrio o zona"
                        autoComplete="address-level2"
                      />
                      <FieldDescription>
                        Nos ayuda a entender mejor desde dónde nos visitan
                        nuestros clientes.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>

          <div className="mt-6">
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reiniciar formulario
              </Button>
              {isSubmitting ? (
                <Button type="button" form="rate-us-form">
                  <Spinner className="ml-2" />
                  Enviando...
                </Button>
              ) : (
                <Button type="submit" form="rate-us-form">
                  Enviar reseña
                </Button>
              )}
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
