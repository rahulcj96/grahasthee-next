import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next()
        }

        const token = request.cookies.get('admin_token')?.value

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')
            await jwtVerify(token, secret)
            return NextResponse.next()
        } catch (err) {
            // Token invalid or expired
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [ '/admin/:path*' ],
}
