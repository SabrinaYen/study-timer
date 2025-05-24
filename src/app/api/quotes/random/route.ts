import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';
import Quote from '../../../../../models/Quote';

export async function GET() {
  await dbConnect();

  const randomQuote = await Quote.aggregate([{ $sample: { size: 1 } }]);
  return NextResponse.json(randomQuote[0]); // Just one random quote
}