import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  // Opsional: Proteksi jika CRON_SECRET diset di Environment Variables Vercel
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // Query ringan: ambil 1 data dari tabel about_me untuk merefresh aktivitas Supabase
    const { data, error } = await supabase
      .from("about_me")
      .select("id")
      .limit(1);

    if (error) {
      console.error("[Keep-Alive Error]", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase keep-alive ping successful",
      timestamp: new Date().toISOString(),
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Keep-Alive Exception]", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
