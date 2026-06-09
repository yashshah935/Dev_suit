import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execPromise = promisify(exec);

export const maxDuration = 60; // Extend serverless limit to 60s if applicable

export async function POST(request: NextRequest) {
  let inputPath = "";
  let outputPath = "";

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bitrate = formData.get("bitrate") || "192";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Save uploaded file to temp directory
    const tempDir = os.tmpdir();
    const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    inputPath = path.join(tempDir, `input_${uniqueId}.mp4`);
    outputPath = path.join(tempDir, `output_${uniqueId}.mp3`);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(inputPath, buffer);

    // Run FFmpeg to extract audio
    // -vn: ignore video, -b:a: set audio bitrate, -y: overwrite
    const ffmpegCommand = `ffmpeg -i "${inputPath}" -vn -b:a ${bitrate}k -y "${outputPath}"`;
    
    try {
      await execPromise(ffmpegCommand);
    } catch (ffmpegErr: any) {
      console.error("FFmpeg execution error:", ffmpegErr);
      return NextResponse.json(
        { error: `FFmpeg extraction failed: ${ffmpegErr.message || ffmpegErr}` },
        { status: 500 }
      );
    }

    if (!fs.existsSync(outputPath)) {
      return NextResponse.json({ error: "FFmpeg completed but output file was not created." }, { status: 500 });
    }

    // Read converted file
    const mp3Buffer = await fs.promises.readFile(outputPath);

    // Clean up files asynchronously
    fs.promises.unlink(inputPath).catch((err) => console.error("Temp file cleanup failed:", err));
    fs.promises.unlink(outputPath).catch((err) => console.error("Temp file cleanup failed:", err));

    const originalName = file.name || "audio.mp4";
    const outputName = originalName.replace(/\.[^/.]+$/, "") + ".mp3";

    // Return file stream
    return new NextResponse(mp3Buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(outputName)}"`,
        "Content-Length": mp3Buffer.length.toString(),
      },
    });

  } catch (error: any) {
    // Attempt cleanup if paths are populated
    if (inputPath && fs.existsSync(inputPath)) {
      fs.promises.unlink(inputPath).catch(() => {});
    }
    if (outputPath && fs.existsSync(outputPath)) {
      fs.promises.unlink(outputPath).catch(() => {});
    }

    console.error("MP4 to MP3 controller error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process audio extraction." },
      { status: 500 }
    );
  }
}
