import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('resume') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const pdfData = await pdfParse(buffer);
        const extractedText = pdfData.text;

        // Return the extracted text directly
        return NextResponse.json({ data: extractedText });
    } catch (error: any) {
        console.error("Error in upload-resume API:", error);
        return NextResponse.json(
            { error: error?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}