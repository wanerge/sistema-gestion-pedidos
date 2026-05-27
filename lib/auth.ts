"use server";

import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  const payload = verifyAccessToken(accessToken) as {
    id: string;
    role: string;
    email: string;
  };

  return payload;
}
