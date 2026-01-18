import { createClient } from '@supabase/supabase-js';
import PolicyPage from "@/components/PolicyPage";
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const policy = await getPolicy(slug);

    if (!policy) {
        return {
            title: 'Policy Not Found',
        };
    }

    return {
        title: `${policy.title} | Grahasthee`,
    };
}

async function getPolicy(slug) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data } = await supabase
        .from('policies')
        .select('*')
        .eq('slug', slug)
        .single();

    return data;
}

import styles from '@/styles/PolicyPage.module.css';

export default async function DynamicPolicyPage({ params }) {
    const { slug } = await params;
    const policy = await getPolicy(slug);

    if (!policy) {
        notFound();
    }

    return (
        <PolicyPage title={policy.title}>
            <div className={styles.policyContainer} dangerouslySetInnerHTML={{ __html: policy.content }} />
        </PolicyPage>
    );
}
