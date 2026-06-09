import { NextRequest, NextResponse } from "next/server";
import { XMLParser, XMLValidator } from "fast-xml-parser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const xml = body.xml;
    
    if (xml === undefined || xml === null || xml.trim() === "") {
      return NextResponse.json(
        { error: "Input XML is empty." },
        { status: 400 }
      );
    }

    const validationResult = XMLValidator.validate(xml);
    if (validationResult !== true) {
      const err = validationResult.err;
      return NextResponse.json(
        { 
          error: `XML Validation Error: ${err.msg} (Line ${err.line}, Column ${err.col})`,
          line: err.line,
          col: err.col
        },
        { status: 400 }
      );
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      parseAttributeValue: true,
    });
    
    const parsed = parser.parse(xml);
    return NextResponse.json({ json: parsed });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to parse XML." },
      { status: 500 }
    );
  }
}
