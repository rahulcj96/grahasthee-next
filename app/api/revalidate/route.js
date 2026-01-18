import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');
        const path = searchParams.get('path');
        const tag = searchParams.get('tag');

        // Verify secret to prevent unauthorized revalidation
        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        if (path) {
            revalidatePath(path);
            return NextResponse.json({ revalidated: true, now: Date.now() });
        }

        if (tag) {
            revalidateTag(tag);
            return NextResponse.json({ revalidated: true, now: Date.now() });
        }

        return NextResponse.json({
            revalidated: false,
            now: Date.now(),
            message: 'Missing path or tag to revalidate'
        });

    } catch (err) {
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        );
    }
}

// Allow GET requests as well for easy testing via browser/curl
export async function GET(request) {
    return POST(request);
}
