// ============================================================
//  phone.js — মোবাইল নাম্বার থেকে অটোমেটিক tel: ও wa.me লিংক তৈরি
//  এডমিনে শুধু নাম্বার রাখলেই হবে (+৮৮ বা ড্যাশ থাকুক বা না থাকুক),
//  বাকিটা এখান থেকেই স্বয়ংক্রিয়ভাবে তৈরি হয়ে যায়।
// ============================================================

// যেকোনো ফরম্যাটে লেখা নাম্বার থেকে শুধু সংখ্যাগুলো বের করে,
// শুরুর ৮৮/০ সরিয়ে বাংলাদেশের ১০ সংখ্যার জাতীয় নাম্বার রিটার্ন করে
function nationalDigits(value) {
  let d = (value || '').replace(/\D/g, '')
  if (d.startsWith('880')) d = d.slice(3)
  else if (d.startsWith('88')) d = d.slice(2)
  if (d.startsWith('0')) d = d.slice(1)
  return d
}

export function telHref(phone) {
  const n = nationalDigits(phone)
  return n ? `tel:+880${n}` : ''
}

export function whatsappHref(whatsapp) {
  const n = nationalDigits(whatsapp)
  return n ? `https://wa.me/880${n}` : ''
}
