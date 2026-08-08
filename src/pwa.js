// সার্ভিস ওয়ার্কার রেজিস্টার করে — এটা ছাড়া PWA ইনস্টলযোগ্য হবে না
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })
