import { NextRequest, NextResponse } from "next/server";

function chunkText(text: string, maxLength = 200): string[] {
  const chunks: string[] = [];
  let currentChunk = "";
  
  // Split by whitespace preserving word boundaries
  const words = text.split(/(\s+)/);
  for (const word of words) {
    if ((currentChunk + word).length > maxLength) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = word;
    } else {
      currentChunk += word;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, lang = "en" } = body;

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "Text is empty." },
        { status: 400 }
      );
    }

    // Google Translate TTS is capped at 200 chars per request, we use 150 for safety
    const textChunks = chunkText(text, 150);
    const audioBuffers: Buffer[] = [];

    for (const chunk of textChunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });

      if (!response.ok) {
        throw new Error(`Google TTS service returned status ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      audioBuffers.push(Buffer.from(arrayBuffer));
    }

    // MP3 frames can be concatenated directly to form a single continuous stream
    const combinedBuffer = Buffer.concat(audioBuffers);

    return new NextResponse(combinedBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="speech.mp3"',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate text to speech audio." },
      { status: 500 }
    );
  }
}
