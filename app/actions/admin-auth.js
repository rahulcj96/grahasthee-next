'use server'

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin table access if needed, or anon if safe
// Actually, to access 'admin_users' safely, we likely need the service role key if we turn on RLS. 
// For now, assuming RLS is off or 'public' read is allowed (checked earlier, RLS is false).
// However, it's better to use Service Role for admin operations to bypass typical restrictions.
// Let's check environment variables availability in user context? No, I should assume standard setup.
// I'll use the anon key for now if RLS is off, but safer to use service role if available. 
// I'll stick to a standard client creation.

// NOTE: Ideally, we should use a separate client for admin actions. 
// If RLS is FALSE on admin_users, anon key works.

export async function loginAdmin(prevState, formData) {
    const username = formData.get('username')
    const password = formData.get('password')

    if (!username || !password) {
        return { error: 'Username and password are required' }
    }

    const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single()

    if (error || !admin) {
        return { error: 'Invalid credentials' }
    }

    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
        return { error: 'Invalid credentials' }
    }

    // Create Session
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')
    const token = await new SignJWT({ id: admin.id, username: admin.username, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secret)

    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    })

    redirect('/admin')
}

export async function logoutAdmin() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_token')
    redirect('/admin/login')
}
