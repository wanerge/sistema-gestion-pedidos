"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { emoji: "🐶", name: "Perros", count: 48 },
  { emoji: "🐱", name: "Gatos", count: 36 },
  { emoji: "🐦", name: "Aves", count: 24 },
  { emoji: "🐟", name: "Peces", count: 19 },
  { emoji: "🐹", name: "Roedores", count: 15 },
  { emoji: "🦎", name: "Reptiles", count: 11 },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Alimento Premium Adulto",
    animal: "Perros",
    price: 89_900,
    oldPrice: 112_000,
    rating: 4.8,
    reviews: 124,
    badge: "Más vendido",
    img: "/products/food-dog.png",
  },
  {
    id: 2,
    name: "Rascador Torre Deluxe",
    animal: "Gatos",
    price: 149_900,
    oldPrice: 180_000,
    rating: 4.7,
    reviews: 89,
    badge: "Nuevo",
    img: "/products/cat-tower.png",
  },
  {
    id: 3,
    name: "Kit Acuario Starter",
    animal: "Peces",
    price: 219_000,
    oldPrice: null,
    rating: 4.9,
    reviews: 56,
    badge: null,
    img: "/products/aquarium.png",
  },
  {
    id: 4,
    name: "Collar Antipulgas Premium",
    animal: "Perros",
    price: 45_900,
    oldPrice: 59_000,
    rating: 4.6,
    reviews: 203,
    badge: "Oferta",
    img: "/products/collar.png",
  },
];

interface Review {
  reviewId: number;
  entity: string;
  name: string;
  location: string;
  pet: string;
  text: string;
  rating: number;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function discount(old: number, current: number) {
  return Math.round(((old - current) / old) * 100);
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Landing() {
  const [review, setReview] = React.useState<Review[] | null>(null);

  async function getRating() {
    try {
      const response = await fetch(
        "https://npyuezu3cl.execute-api.us-east-1.amazonaws.com/dev/reviews",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch review rating.");
        }
        return res;
      });
      setReview(await response.json());
    } catch (error) {
      console.error("Error fetching review rating:", error);
    }
  }

  React.useEffect(() => {
    getRating();
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-b from-amber-50 via-white to-orange-50 text-slate-900">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-amber-100/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-white.svg"
              alt="Logo Tienda de Mascotas"
              width={48}
              height={48}
              priority
              className="h-12 w-12 rounded-full object-contain"
            />
            <div className="leading-tight">
              <p className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                Tienda de Mascotas
              </p>
              <p className="hidden text-xs font-medium text-slate-500 sm:block">
                Todo para tu mascota
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/rate-us"
              className="text-sm font-medium text-slate-600 transition hover:text-amber-600"
            >
              califícanos
            </Link>
            <Link href="/login">
              <Button variant="black" size="xlg">
                Ingresar
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.18),transparent_50%),radial-gradient(ellipse_at_right,rgba(249,115,22,0.12),transparent_40%)]"
        />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
              <span className="text-base leading-none" aria-hidden="true">
                🐾
              </span>
              <span>Compra con confianza para perros, gatos y más</span>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Todo lo que tu mascota ama, en un solo lugar.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Descubre productos seleccionados para cuidar, consentir y
                acompañar cada etapa de su vida. Regístrate para ver precios,
                reservar favoritos y comprar de forma simple y segura.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/login">
                <Button variant="black" size="xlg" className="w-full sm:w-auto">
                  Ver productos
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="xlg"
                  className="w-full sm:w-auto"
                >
                  Registrarse
                </Button>
              </Link>
            </div>

            {/* Trust bar */}
            <div className="grid gap-3 rounded-3xl border border-amber-100 bg-white/80 p-4 shadow-sm sm:grid-cols-3 sm:p-5">
              {[
                { icon: "⚡", label: "Envío 24h" },
                { icon: "🔒", label: "Pago seguro" },
                { icon: "↩", label: "Devolución 30 días" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-lg"
                  >
                    {icon}
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-end justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-4 h-40 rounded-full bg-amber-200/40 blur-2xl will-change-transform"
            />
            <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_20px_70px_rgba(120,53,15,0.15)] backdrop-blur">
              <div className="rounded-[1.5rem] bg-linear-to-br from-amber-100 via-white to-orange-50 p-4">
                <Image
                  src="/backgroundless-model.png"
                  alt="Mascota protagonista de la tienda"
                  width={432}
                  height={616}
                  priority
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categorías ── */}
      <section
        id="categorias"
        className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Explora por categoría
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Inicia sesión para ver el catálogo completo y precios.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ emoji, name, count }) => (
            <article
              key={name}
              className="group rounded-3xl border border-amber-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                {emoji}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{name}</h3>
              <p className="mt-1 text-sm text-slate-500">{count} productos</p>
              <Link
                href="/login"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-600 transition group-hover:gap-2"
              >
                Ver todos <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Productos Destacados ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Productos destacados
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Los favoritos de nuestra comunidad esta semana.
            </p>
          </div>
          <Link
            href="/login"
            className="hidden shrink-0 text-sm font-medium text-amber-600 hover:underline sm:block"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {product.badge && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                  {product.badge}
                </span>
              )}

              {/* Imagen placeholder — reemplaza src con rutas reales */}
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-linear-to-br from-amber-50 to-orange-50">
                <span className="text-6xl" aria-hidden="true">
                  {CATEGORIES.find((c) => c.name === product.animal)?.emoji ??
                    "🛒"}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                  {product.animal}
                </p>
                <h3 className="text-sm font-bold leading-snug text-slate-900">
                  {product.name}
                </h3>

                {/* Rating */}
                <div
                  className="flex items-center gap-1"
                  aria-label={`${product.rating} de 5 estrellas`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-slate-200"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-xs text-slate-400">
                    ({product.reviews})
                  </span>
                </div>

                {/* Precio */}
                <div className="mt-auto flex items-baseline gap-2 pt-2">
                  <span className="text-base font-black text-slate-900">
                    {formatCOP(product.price)}
                  </span>
                  {product.oldPrice && (
                    <>
                      <span className="text-xs text-slate-400 line-through">
                        {formatCOP(product.oldPrice)}
                      </span>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                        -{discount(product.oldPrice, product.price)}%
                      </span>
                    </>
                  )}
                </div>

                <Link href="/login" className="mt-2 block w-full">
                  <Button variant="black" size="xlg" className="w-full text-sm">
                    Agregar al carrito
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/login">
            <Button variant="outline" size="xlg">
              Ver todos los productos →
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Más de 1.200 familias confían en nosotros cada mes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {review?.map((t) => (
            <blockquote
              key={t.reviewId}
              className="flex flex-col gap-4 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label="5 estrellas">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-amber-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="flex-1 text-sm leading-7 text-slate-600">
                &ldquo;{t.text}&rdquo;
              </p>

              <footer className="flex items-center gap-3">
                {/* <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  {t.initials}
                </div> */}
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">
                    {t.pet} · {t.location}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ── CTA de conversión ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-amber-200 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-8 text-white shadow-lg sm:px-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-100">
                Acceso exclusivo
              </p>
              <h2 className="max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">
                Regístrate para ver precios, comprar rápido y recibir ofertas
                pensadas para tu mascota.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-amber-50 sm:text-base">
                Crear tu cuenta toma segundos y te permite revisar el catálogo,
                comparar opciones y finalizar la compra con una experiencia
                confiable desde el primer clic.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="black"
                  size="xlg"
                  className="w-full bg-white text-slate-950 hover:bg-amber-50"
                >
                  Registrarse ahora
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="xlg"
                  className="w-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-amber-100 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Marca */}
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo-white.svg"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-contain"
                />
                <span className="text-sm font-extrabold text-slate-900">
                  Tienda de Mascotas
                </span>
              </Link>
              <p className="text-xs leading-6 text-slate-500">
                Productos seleccionados para que tu mascota viva su mejor vida.
              </p>
            </div>

            {/* Tienda */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Tienda
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  "Perros",
                  "Gatos",
                  "Aves",
                  "Peces",
                  "Roedores",
                  "Reptiles",
                ].map((cat) => (
                  <li key={cat}>
                    <Link
                      href="/login"
                      className="transition hover:text-amber-600"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Información */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Información
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  "Política de envíos",
                  "Devoluciones",
                  "Términos y condiciones",
                  "Política de privacidad",
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="transition hover:text-amber-600">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Contacto
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>📧 hola@tiendademascotas.co</li>
                <li>📞 +57 300 000 0000</li>
                <li className="flex gap-3 pt-1">
                  {["Instagram", "Facebook", "TikTok"].map((red) => (
                    <Link
                      key={red}
                      href="#"
                      className="text-xs font-medium text-amber-600 hover:underline"
                    >
                      {red}
                    </Link>
                  ))}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-amber-100 pt-6 sm:flex-row">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Tienda de Mascotas · Todos los
              derechos reservados
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Métodos de pago:</span>
              {["Visa", "Mastercard", "Nequi", "PSE"].map((mp) => (
                <span
                  key={mp}
                  className="rounded border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500"
                >
                  {mp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
