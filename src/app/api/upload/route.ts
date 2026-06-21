import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const BUCKET = 'public_pyramid';

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('pyramid_token')?.value;
  if (!token) return false;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  return jwtVerify(token, secret).then(() => true).catch(() => false);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ message: 'No file provided' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = await file.arrayBuffer();

  const res = await fetch(
    `${process.env.SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: buffer,
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ message: text }, { status: res.status });
  }

  const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  return NextResponse.json({ url });
}
