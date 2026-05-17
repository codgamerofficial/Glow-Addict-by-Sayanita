import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const generatedPath = path.join(process.cwd(), 'src', 'data', 'generated-catalog.json');

export async function GET() {
  try {
    const raw = await fs.readFile(generatedPath, 'utf8');
    const json = JSON.parse(raw);
    return NextResponse.json({ products: json.products || [] });
  } catch (err) {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raw = await fs.readFile(generatedPath, 'utf8');
    const json = JSON.parse(raw);
    json.products = json.products || [];
    json.products.push(body);
    await fs.writeFile(generatedPath, JSON.stringify(json, null, 2), 'utf8');
    return NextResponse.json({ ok: true, id: body.id || null }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
