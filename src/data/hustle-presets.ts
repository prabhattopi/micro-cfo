import type { HustlePreset } from "@/types/finance";

export const STUDENT_HUSTLE_PRESETS: HustlePreset[] = [
  {
    id: "campus-bakery",
    title: "Campus Hall Bakery & Cookies",
    category: "Food & Beverage",
    tagline: "Batch-baking artisanal cookies & brownies for dorm mates and campus pop-ups",
    iconName: "Cookie",
    defaultInputs: {
      name: "Hall 4 Cookie Club",
      category: "Food & Beverage",
      currency: "HKD",
      sellingPrice: 45.0,            // HK$45 per box of 4 cookies
      variableCostPerUnit: 14.0,     // HK$14 (butter, flour, Belgian chocolate, custom box + sticker)
      platformFeePercent: 0.035,     // 3.5% (PayMe for Business / FPS merchant fee)
      fixedPaymentFee: 1.0,          // HK$1.00 payment processing
      fixedMonthlyCosts: 280.0,      // HK$280/mo (oven electricity surcharge, baking parchment roll)
      hoursPerUnit: 0.45,            // ~27 mins per batch box
      monthlyVolumeTarget: 35,       // Target: 35 boxes per month (~9 boxes/week)
      initialCapital: 1200.0,        // Starting baking tools & ingredient budget
    },
  },
  {
    id: "freelance-video-editor",
    title: "TikTok / Reels Creator & Editor",
    category: "Digital Freelancing",
    tagline: "Editing fast-paced viral reels for student clubs and local campus cafes",
    iconName: "Video",
    defaultInputs: {
      name: "Campus ReelCraft Studios",
      category: "Digital Freelancing",
      currency: "HKD",
      sellingPrice: 380.0,           // HK$380 per finished reel (30-60s)
      variableCostPerUnit: 25.0,     // HK$25 (licensing stock audio/SFX per video)
      platformFeePercent: 0.05,      // 5% (freelance invoicing / platform fee)
      fixedPaymentFee: 0.0,
      fixedMonthlyCosts: 320.0,      // HK$320/mo (CapCut Pro / Adobe Creative Cloud student rate, Google Drive)
      hoursPerUnit: 2.5,             // 2.5 hours per edited video
      monthlyVolumeTarget: 8,        // Target: 2 reels per week (8/month)
      initialCapital: 1500.0,        // Savings buffer
    },
  },
  {
    id: "campus-hoodies",
    title: "Society Merch & Custom Hoodies",
    category: "Apparel & Retail",
    tagline: "Designing and printing custom hoodies for student halls and graduation batches",
    iconName: "Shirt",
    defaultInputs: {
      name: "PolyU PolyThread Society Merch",
      category: "Apparel & Retail",
      currency: "HKD",
      sellingPrice: 220.0,           // HK$220 per hoodie
      variableCostPerUnit: 110.0,    // HK$110 (blank heavy-blend fleece hoodie + DTG printing + polybag)
      platformFeePercent: 0.04,      // 4% (online order form + payment gateway)
      fixedPaymentFee: 2.0,
      fixedMonthlyCosts: 350.0,      // HK$350/mo (prototyping sample garments, domain)
      hoursPerUnit: 0.6,             // Packaging & distribution time
      monthlyVolumeTarget: 25,       // Target: 25 hoodies/batch
      initialCapital: 3000.0,        // Upfront supplier deposit
    },
  },
  {
    id: "carousell-thrifting",
    title: "Vintage Thrifting & Resale",
    category: "E-Commerce",
    tagline: "Curating vintage streetwear from markets and reselling on Carousell & Instagram",
    iconName: "ShoppingBag",
    defaultInputs: {
      name: "Kowloon Archive Vintage",
      category: "E-Commerce",
      currency: "HKD",
      sellingPrice: 160.0,           // HK$160 per curated vintage piece
      variableCostPerUnit: 48.0,     // HK$48 (source garment cost + eco shipping mailer + sanitization)
      platformFeePercent: 0.02,      // 2% Carousell bump fee average
      fixedPaymentFee: 1.5,
      fixedMonthlyCosts: 180.0,      // HK$180/mo (fabric steamer amort., studio lighting bulb)
      hoursPerUnit: 1.1,             // Sourcing, photographing, measurement, shipping
      monthlyVolumeTarget: 16,       // Target: 4 pieces/week
      initialCapital: 1500.0,        // Sourcing capital
    },
  },
  {
    id: "peer-tutoring",
    title: "DSE / IB Peer Exam Tutoring",
    category: "Education & Coaching",
    tagline: "1-on-1 intensive subject tutoring and customized mock exam marking",
    iconName: "GraduationCap",
    defaultInputs: {
      name: "TopTier Poly Prep Tutoring",
      category: "Education & Coaching",
      currency: "HKD",
      sellingPrice: 280.0,           // HK$280 per 90-min session
      variableCostPerUnit: 18.0,     // HK$18 (printed past-paper booklets, binding)
      platformFeePercent: 0.0,       // Direct FPS / cash
      fixedPaymentFee: 0.0,
      fixedMonthlyCosts: 120.0,      // HK$120/mo (Zoom Pro, Notion template subscriptions)
      hoursPerUnit: 2.0,             // 1.5 hrs session + 0.5 hr marking/prep
      monthlyVolumeTarget: 12,       // Target: 3 sessions/week
      initialCapital: 500.0,         // Basic teaching stationery
    },
  },
];
