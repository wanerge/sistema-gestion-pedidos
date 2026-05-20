"use client";

import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-center">
          <Link href="/login" className="flex items-center gap-2 font-medium">
            <Image
              src="/logo-white.svg"
              alt="Logo"
              width={200}
              height={200}
              loading="eager"
              className="h-50 w-50"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/background-model.png"
          alt="Image Container"
          width={1040}
          height={1024}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
