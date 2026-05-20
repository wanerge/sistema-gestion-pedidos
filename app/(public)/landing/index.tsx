import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const index = () => {
  return (
    <div>
      <div
        className="sticky top-0 z-50 flex flex-row items-center justify-around w-full bg-background text-foreground shadow-md
       py-2"
      >
        <Link
          href="/"
          className="flex flex-row items-center justify-center gap-4"
        >
          <div className="flex flex-row items-center justify-center gap-4">
            <Image
              src="/logo-white.svg"
              alt="Logo"
              width={68}
              height={68}
              loading="eager"
              className="h-17 w-17 object-contain"
            />
            <p className="text-2xl font-extrabold">Tienda de Mascotas</p>
          </div>
        </Link>

        <div className="flex flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button variant="black" size="xlg">
              Login
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative w-full h-screen flex flex-col items-center justify-center bg-chart-1 text-black">
        <div className="relative w-full h-1/2 flex items-center justify-center z-0">
          <Image
            src="/element.svg"
            alt="Element"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            loading="eager"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="absolute w-full flex flex-row items-start justify-center z-10">
          <div className="h-full flex flex-col items-center justify-start mt-20">
            <div className="flex flex-col justify-around items-start max-w-2xl px-4 gap-10">
              <div>
                <h1 className="text-blanco text-6xl font-bold">
                  Todo lo que tu mascota necesita
                </h1>
              </div>
              <div>
                <p className="text-blanco text-lg">
                  Encuentra alimentos, juguetes, accesorios y productos de
                  calidad para mantener feliz y saludable a tu mascota. Inicia
                  sesión y descubre todo lo que necesita tu mejor amigo.
                </p>
              </div>
              <div className="mt-7">
                <Link href="/login">
                  <Button variant="black" size="xlg">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/backgroundless-model.png"
              alt="Image Container"
              width={432}
              height={616}
              loading="eager"
              className="h-154 w-108 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
