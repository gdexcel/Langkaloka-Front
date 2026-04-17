//langkaloka-v1\app\api\upload\route.ts
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    const uploaded = await cloudinary.uploader.upload(image, {
      folder: "langkaloka",
    });

    return NextResponse.json({
      url: uploaded.secure_url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
