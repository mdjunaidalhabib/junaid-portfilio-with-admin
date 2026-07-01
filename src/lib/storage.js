import { supabase } from './supabase'

// Supabase Storage-এর যে bucket-এ profile ছবি ও CV রাখা হবে
export const ASSETS_BUCKET = 'portfolio-assets'

// ফাইল আপলোড করে public URL রিটার্ন করে (cache-busting query সহ, যাতে
// আগের ছবি/PDF browser cache-এ আটকে না থাকে)
export async function uploadAsset(file, path) {
  const { error } = await supabase
    .storage
    .from(ASSETS_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600' })

  if (error) throw error

  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(path)
  return `${data.publicUrl}?v=${Date.now()}`
}
