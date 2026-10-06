export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Storefront, { Product } from './Storefront';

// Diverse set of dummy products to showcase category filtering
const DUMMY_PRODUCTS: Product[] = [
  { id: 1, name_ar: 'لحم عجل بلدي بدون عظم', name_en: 'Local Veal Boneless', price: 65.50, category_ar: 'لحم بقر', category_en: 'Beef', isNew: true },
  { id: 2, name_ar: 'مفروم غنم طازج', name_en: 'Fresh Minced Lamb', price: 55.00, category_ar: 'مفروم', category_en: 'Minced', isBestSeller: true },
  { id: 3, name_ar: 'ريش غنم متبلة', name_en: 'Marinated Lamb Chops', price: 85.00, category_ar: 'مشاوي', category_en: 'BBQ' },
  { id: 4, name_ar: 'ستيك واجيو', name_en: 'Wagyu Steak', price: 150.00, category_ar: 'لحم بقر', category_en: 'Beef' },
  { id: 5, name_ar: 'كتف غنم كامل', name_en: 'Whole Lamb Shoulder', price: 120.00, category_ar: 'لحم غنم', category_en: 'Lamb', isBestSeller: true },
  { id: 6, name_ar: 'برجر دجاج طازج (٤ قطع)', name_en: 'Fresh Chicken Burger (4 pcs)', price: 35.00, category_ar: 'دجاج', category_en: 'Chicken' },
  { id: 7, name_ar: 'مفروم بقر ممتاز', name_en: 'Premium Minced Beef', price: 45.00, category_ar: 'مفروم', category_en: 'Minced' },
  { id: 8, name_ar: 'كباب لحم للشواء', name_en: 'Meat Kebab for BBQ', price: 60.00, category_ar: 'مشاوي', category_en: 'BBQ', isNew: true },
];

export default async function TenantPage({ params }: { params: Promise<{ tenant_id: string, locale: string }> }) {
  const { tenant_id, locale } = await params;

  // Initialize Supabase Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch the specific tenant based on the URL parameter (tenant_id / slug)
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', tenant_id)
    .single();

  // If no tenant is found, render the 404 Not Found page
  if (tenantError || !tenant) {
    notFound();
  }

  // Determine dynamic data based on locale
  const storeName = locale === 'ar' ? tenant.name_ar : tenant.name_en;
  const isRtl = locale === 'ar';

  return (
    <Storefront 
      storeName={storeName} 
      isRtl={isRtl} 
      initialProducts={DUMMY_PRODUCTS} 
    />
  );
}
