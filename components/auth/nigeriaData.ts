export const NG_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export const NG_LGAS: Record<string, string[]> = {
  "FCT - Abuja": ["Abaji", "Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  "Lagos": ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"],
  "Kano": ["Dala", "Fagge", "Gwale", "Kano Municipal", "Nassarawa", "Tarauni", "Ungogo", "Kumbotso"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Okrika", "Ogu-Bolo", "Eleme", "Tai", "Gokana", "Khana"],
  "Oyo": ["Ibadan North", "Ibadan South-East", "Ibadan South-West", "Ibadan North-East", "Ibadan North-West", "Egbeda", "Akinyele", "Lagelu"],
  "Kaduna": ["Kaduna North", "Kaduna South", "Chikun", "Igabi", "Birnin Gwari", "Zaria", "Sabon Gari"],
  "Anambra": ["Awka North", "Awka South", "Nnewi North", "Nnewi South", "Onitsha North", "Onitsha South", "Ihiala", "Ogbaru"],
  "Imo": ["Owerri Municipal", "Owerri North", "Owerri West", "Aboh Mbaise", "Ahiazu Mbaise", "Ngor Okpala"],
  "Delta": ["Warri North", "Warri South", "Warri South-West", "Ughelli North", "Ughelli South", "Asaba", "Oshimili North"],
  "Enugu": ["Enugu East", "Enugu North", "Enugu South", "Igbo-Eze North", "Nkanu East", "Nkanu West"],
};

export const IDENTITY_TYPES = [
  { value: "nin", label: "National Identification Number (NIN)" },
  { value: "bvn", label: "Bank Verification Number (BVN)" },
  { value: "voters_card", label: "Voter's Card" },
  { value: "international_passport", label: "International Passport" },
  { value: "drivers_licence", label: "Driver's Licence" },
];

export const QUALIFICATIONS = [
  { value: "none", label: "No formal education" },
  { value: "primary", label: "Primary School" },
  { value: "secondary", label: "Secondary School (WAEC / NECO)" },
  { value: "ond_nce", label: "OND / NCE" },
  { value: "hnd_bsc", label: "HND / B.Sc / B.A" },
  { value: "postgraduate", label: "Postgraduate (M.Sc / MBA / Ph.D)" },
];

export const LITERACY_LEVELS = [
  { value: "read_write", label: "I can read and write" },
  { value: "numerate", label: "I can count / work with numbers" },
  { value: "both", label: "Both — reading, writing and numeracy" },
  { value: "neither", label: "Neither / prefer not to say" },
];

export const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "I don't know"];

export const MEDICAL_CONDITIONS = [
  "Diabetes", "Hypertension", "Sickle Cell Disease", "Asthma", "HIV/AIDS",
  "Tuberculosis", "Epilepsy", "Mental health condition", "Physical disability",
  "Visual impairment", "Hearing impairment", "None", "Prefer not to say",
];

export const WELFARE_INTERESTS = [
  "Healthcare access",
  "Education support",
  "Livelihood / skills training",
  "Microfinance / credit access",
  "Emergency relief",
  "Social protection schemes",
  "Housing assistance",
  "Food & nutrition support",
  "Child welfare",
  "Disability support",
  "Other (please specify)",
];

export const INDUSTRIES = [
  "Agriculture", "Banking / Finance", "Construction", "Education",
  "Energy / Oil & Gas", "Government / Public Service", "Healthcare",
  "ICT / Technology", "Legal", "Manufacturing", "Media / Entertainment",
  "Mining", "Non-profit / NGO", "Real Estate", "Retail / Trade",
  "Security", "Telecommunications", "Transport / Logistics", "Other",
];

export const BUSINESS_SCALES = [
  { value: "sole_trader", label: "Sole trader (just me)" },
  { value: "micro", label: "Micro (2–9 employees)" },
  { value: "small", label: "Small (10–49 employees)" },
  { value: "medium", label: "Medium (50+ employees)" },
];

export const UNEMPLOYMENT_ENGAGEMENTS = [
  { value: "job_seeking", label: "Actively looking for work" },
  { value: "skills", label: "Acquiring a skill or trade" },
  { value: "further_education", label: "Pursuing further education" },
  { value: "caregiving", label: "Full-time caregiver (family)" },
  { value: "other", label: "Other" },
];
