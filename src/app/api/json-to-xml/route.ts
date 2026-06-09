import { NextRequest, NextResponse } from "next/server";
import { XMLBuilder } from "fast-xml-parser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jsonString = body.jsonString;
    
    if (jsonString === undefined || jsonString === null || jsonString.trim() === "") {
      return NextResponse.json(
        { error: "Input JSON is empty." },
        { status: 400 }
      );
    }

    let parsedJson: any;
    try {
      parsedJson = JSON.parse(jsonString);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Invalid JSON syntax: ${err.message}` },
        { status: 400 }
      );
    }

    // In XML, we must have a single root element. If the parsed JSON is an array or a primitive,
    // we should wrap it or return an error. Let's wrap it in a root node if it's not a single root object.
    let xmlTarget = parsedJson;
    if (typeof parsedJson !== "object" || parsedJson === null) {
      xmlTarget = { root: parsedJson };
    } else if (Array.isArray(parsedJson)) {
      xmlTarget = { root: { item: parsedJson } };
    }

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      format: true,
      indentBy: "  ",
      suppressEmptyNode: false,
    });

    const xmlContent = builder.build(xmlTarget);
    // Add XML declaration if not present
    const finalXml = xmlContent.startsWith("<?xml") 
      ? xmlContent 
      : `<?xml version="1.0" encoding="UTF-8"?>\n${xmlContent}`;

    return NextResponse.json({ xml: finalXml });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to build XML." },
      { status: 500 }
    );
  }
}
