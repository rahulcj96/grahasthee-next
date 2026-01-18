import { createClient } from 'jsr:@supabase/supabase-js@2'

console.log("Hello from revalidate-content function!")

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { record, table, type, old_record } = await req.json()
        const config = {
            revalSecret: Deno.env.get('REVALIDATION_SECRET'),
            siteUrl: Deno.env.get('NEXT_PUBLIC_SITE_URL'),
        }

        if (!config.revalSecret || !config.siteUrl) {
            throw new Error('Missing environment variables: REVALIDATION_SECRET or NEXT_PUBLIC_SITE_URL')
        }

        const pathsToRevalidate = new Set<string>()
        const tagsToRevalidate = new Set<string>()

        // Initialize Supabase Client to query related data (e.g., getting product slug from review)
        const supabaseOpts = {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        }
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            supabaseOpts
        )

        console.log(`Processing ${type} event on table ${table}`)

        // -------------------------------------------------------------------------
        // LOGIC: Products
        // -------------------------------------------------------------------------
        if (table === 'products') {
            // Always revalidate Shop and Home
            pathsToRevalidate.add('/shop')
            pathsToRevalidate.add('/')

            // Revalidate specific Product Page
            if (record?.slug) pathsToRevalidate.add(`/product/${record.slug}`)
            if (old_record?.slug) pathsToRevalidate.add(`/product/${old_record.slug}`)
        }

        // -------------------------------------------------------------------------
        // LOGIC: Categories
        // -------------------------------------------------------------------------
        else if (table === 'categories') {
            // Categories affect Home and Shop filters
            pathsToRevalidate.add('/shop')
            pathsToRevalidate.add('/')
        }

        // -------------------------------------------------------------------------
        // LOGIC: Reviews
        // -------------------------------------------------------------------------
        else if (table === 'reviews') {
            const productId = record?.product_id || old_record?.product_id
            if (productId) {
                // Fetch product slug
                const { data: product } = await supabase
                    .from('products')
                    .select('slug')
                    .eq('id', productId)
                    .single()

                if (product?.slug) {
                    pathsToRevalidate.add(`/product/${product.slug}`)
                }
            }
        }

        // -------------------------------------------------------------------------
        // LOGIC: Product Images
        // -------------------------------------------------------------------------
        else if (table === 'product_images') {
            const productId = record?.product_id || old_record?.product_id
            if (productId) {
                // Fetch product slug
                const { data: product } = await supabase
                    .from('products')
                    .select('slug')
                    .eq('id', productId)
                    .single()

                if (product?.slug) {
                    pathsToRevalidate.add(`/product/${product.slug}`)
                }
            }
            // Images also show on Shop and Home (thumbnails)
            pathsToRevalidate.add('/shop')
            pathsToRevalidate.add('/')
        }

        // -------------------------------------------------------------------------
        // EXECUTE REVALIDATION
        // -------------------------------------------------------------------------
        const results = []

        // Revalidate Paths
        for (const path of pathsToRevalidate) {
            console.log(`Revalidating path: ${path}`)
            const url = `${config.siteUrl}/api/revalidate?secret=${config.revalSecret}&path=${encodeURIComponent(path)}`

            try {
                const res = await fetch(url, { method: 'POST' })
                if (!res.ok) {
                    console.error(`Failed to revalidate ${path}: ${res.statusText}`)
                    results.push({ path, status: 'error', error: res.statusText })
                } else {
                    results.push({ path, status: 'ok' })
                }
            } catch (e) {
                console.error(`Error revalidating ${path}:`, e)
                results.push({ path, status: 'error', error: e.message })
            }
        }

        return new Response(JSON.stringify({
            success: true,
            processed: {
                paths: [...pathsToRevalidate],
                results
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error('Function error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
