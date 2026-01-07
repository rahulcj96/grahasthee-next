import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin_token')?.value
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')

        // Allow access to login page, but redirect if already logged in
        if (request.nextUrl.pathname === '/admin/login') {
            if (token) {
                try {
                    await jwtVerify(token, secret)
                    // If token is valid, redirect to dashboard
                    return NextResponse.redirect(new URL('/admin', request.url))
                } catch (err) {
                    // Token invalid, allow access to login page
                    return NextResponse.next()
                }
            }
            return NextResponse.next()
        }

        // Protect other admin routes
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
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
