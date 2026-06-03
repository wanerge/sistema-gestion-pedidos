import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_REVIEWS_API_URL}/reviews`,
      {
        headers: {
          "content-type": "application/json",
          "x-api-key": process.env.REVIEWS_API_KEY!,
        },
      },
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_REVIEWS_API_URL}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REVIEWS_API_KEY!,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
