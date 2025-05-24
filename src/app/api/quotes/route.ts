import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';
import Quote from '../../../../models/Quote';

export async function GET() {
  await dbConnect();
  const quotes = await Quote.find();
  return NextResponse.json(quotes);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  try {
    const created = await Quote.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
