import { Opportunity, KpiItem, ComplaintItem } from "./types";

/**
 * todo: remove hardcoded values here
 */

export const SUPPORT_OPTIONS: Record<string, string> = {
  scholarship: "Scholarship Track",
  medical_aid_treatment: "Medical Aid & Treatment",
  business_capital: "Business Capital Grant",
  investor_funding: "Investor Funding & Prototype Lab",
  job_opportunity: "Job & Internship Opportunity",
  skill_acquisition: "Digital Skills & Skill Acquisition",
};

export const COHORTS: Record<string, string> = {
  scholarship: "Academic Excellence Cohort",
  medical_aid_treatment: "Healthcare Welfare Cohort",
  business_capital: "SME Empowerment Cohort",
  investor_funding: "Technological Innovation Cohort",
  job_opportunity: "Career Development Cohort",
  skill_acquisition: "Digital Skills Capacity Cohort",
  default: "General Citizens Registry",
};

export const METRICS: Record<string, { kpis: string; progress: number; cohortActive: string; opportunitiesCount: number }> = {
  scholarship: { kpis: "3/4", progress: 75, cohortActive: "92%", opportunitiesCount: 6 },
  medical_aid_treatment: { kpis: "2/3", progress: 66, cohortActive: "88%", opportunitiesCount: 4 },
  business_capital: { kpis: "4/5", progress: 80, cohortActive: "85%", opportunitiesCount: 5 },
  investor_funding: { kpis: "1/4", progress: 25, cohortActive: "90%", opportunitiesCount: 7 },
  job_opportunity: { kpis: "3/5", progress: 60, cohortActive: "84%", opportunitiesCount: 8 },
  skill_acquisition: { kpis: "5/6", progress: 83, cohortActive: "91%", opportunitiesCount: 9 },
  default: { kpis: "2/4", progress: 50, cohortActive: "85%", opportunitiesCount: 5 },
};

export const OPPORTUNITIES_DATA: Record<string, Opportunity[]> = {
  scholarship: [
    {
      id: "op1",
      title: "Federal Tertiary Education Trust Fund (TETFund)",
      type: "Full Tuition Scholarship",
      status: "Open",
      brief: "Covers tuition, accommodation, and stipend for Nigerian students in federal universities.",
      full: "The TETFund Scholarship Scheme aims to support brilliant but financially disadvantaged students studying in Nigerian public universities. Selected scholars receive full coverage of tuition, a yearly book stipend of ₦150,000, and fully paid campus accommodation.",
      docs: "Admission letter, CGPA statement of results (min 3.5/5.0), Local Government Certificate of Origin.",
      officerNotes: "Please ensure your State of Origin matches your uploaded Certificate of Origin. Applications close this Friday.",
      actionLabel: "Submit Scholarship Application",
    },
    {
      id: "op2",
      title: "Chevening - CitiEye Bilateral Partnership Program",
      type: "International Study Grant",
      status: "Upcoming",
      brief: "Joint funding for post-graduate leadership programs in the UK.",
      full: "A unique partnership between the UK Chevening Secretariat and CitiEye to sponsor 50 young Nigerian leaders for Master's degrees in public policy, community development, and public health in the United Kingdom. Covers flights, tuition, and living costs.",
      docs: "Bachelor's Degree Certificate (First Class or 2:1), IELTS Academic (min 7.0), 2 Academic Reference Letters.",
      officerNotes: "This track will open for applications next month. Please prepare your essay drafts in advance.",
      actionLabel: "Set Reminder & Notify Officer",
    },
    {
      id: "op3",
      title: "MTN Foundation Science & Tech Scholarship",
      type: "Annual Cash Grant",
      status: "Open",
      brief: "₦200,000 annual scholarship for students in STEM fields.",
      full: "The MTN Foundation awards annual scholarships to high-achieving 300-level students in public tertiary institutions. Beneficiaries must maintain a cumulative GPA of 3.5 or above to retain the scholarship until graduation.",
      docs: "Student ID card, Departmental Head's recommendation, current academic transcript.",
      officerNotes: "Verify your CGPA with your department before applying to avoid disqualification.",
      actionLabel: "Submit Academic Records",
    },
  ],
  medical_aid_treatment: [
    {
      id: "op4",
      title: "National Health Insurance Authority (NHIA) Subsidy",
      type: "Healthcare Subsidy",
      status: "Active",
      brief: "Up to 90% discount on prescription drugs and general consultation fees.",
      full: "This welfare program covers 90% of the cost of generic drugs and essential consultations at approved federal medical centers. The subsidy is credited directly to your CitiEye citizen health code.",
      docs: "CitiEye citizen code, NIN validation, Doctor's referral prescription.",
      officerNotes: "Officer Aisha Bello has pre-approved your eligibility. Present your code at any NHIA-partnered pharmacy.",
      actionLabel: "Claim Health Insurance Voucher",
    },
    {
      id: "op5",
      title: "Maternal Health & Child Nutrition Aid",
      type: "Nutrition Package",
      status: "Open",
      brief: "Free monthly prenatal checkups and child nutrition packs.",
      full: "For expectant mothers and parents with children under 5 years old. This program provides monthly medical consultations, immunization schedules, and nutrition food baskets containing essential supplements and fortifiers.",
      docs: "Antenatal card, Child birth certificate/registration.",
      officerNotes: "Vouchers are distributed on the 1st and 15th of every month. Check in at your local primary health center.",
      actionLabel: "Schedule Clinic Appointment",
    },
  ],
  business_capital: [
    {
      id: "op6",
      title: "SMEDAN Micro-Enterprise Seed Grant",
      type: "Equity-Free Grant",
      status: "Open",
      brief: "₦500,000 seed grant for registered micro-businesses and artisans.",
      full: "The Small and Medium Enterprises Development Agency of Nigeria (SMEDAN) is partnering with CitiEye to distribute seed capital to registered young business owners. This grant is equity-free and is intended for purchasing capital equipment or inventory.",
      docs: "CAC registration certificate, Tax Identification Number (TIN), Business plan/proposal (maximum 2 pages).",
      officerNotes: "Be sure to upload a video demo of your workshop or products in the 'Metrics' section to increase chance.",
      actionLabel: "Apply for SME Grant",
    },
    {
      id: "op7",
      title: "Bank of Industry (BOI) Interest-Free Tech Loan",
      type: "Interest-Free Loan",
      status: "Open",
      brief: "Interest-free working capital loan up to ₦2,000,000 with 18 months repayment.",
      full: "BOI provides interest-free loan facility to tech startups, digital service agencies, and tech-driven hubs. The loan is payable over 18 months after a 3-month moratorium period.",
      docs: "CAC registration, 2 Guarantors (Level 12+ civil servants or recognized community leaders), 6-month bank statement.",
      officerNotes: "A credit bureau check will be performed. Please ensure you have no outstanding default loans.",
      actionLabel: "Initiate Loan Application",
    },
  ],
  investor_funding: [
    {
      id: "op8",
      title: "National Tech Development Fund & Prototype Lab",
      type: "Incubation Grant",
      status: "Open",
      brief: "₦5,000,000 research and prototyping grant for hardware/software builders.",
      full: "For hardware makers, IoT engineers, and software architects building local solutions. Provides access to state-of-the-art labs in Abuja and Lagos, hardware prototyping materials, and a cash grant to construct pilot versions.",
      docs: "Technical architecture document, circuit design (if hardware), Github repo link (if software), pitch deck.",
      officerNotes: "You will be requested to pitch to the evaluation board on Zoom next month. Prepare a 5-minute slide deck.",
      actionLabel: "Submit Lab Proposal",
    },
  ],
  job_opportunity: [
    {
      id: "op9",
      title: "Federal Graduate Internship Program (FGIP)",
      type: "Paid Internship",
      status: "Open",
      brief: "12-month paid internship with ₦80,000 monthly stipend at federal agencies.",
      full: "FGIP matches young graduates with government ministries, departments, and agencies (MDAs) or partnered private corporations. The program includes professional mentoring and a monthly stipend funded by the federal government.",
      docs: "NYSC Discharge Certificate, Degree certificate (B.Sc/HND, min Second Class Lower), CV.",
      officerNotes: "Please ensure your CV details are fully updated in the profile section before submitting your application.",
      actionLabel: "Apply for Internship Match",
    },
  ],
  skill_acquisition: [
    {
      id: "op11",
      title: "3MTT - 3 Million Technical Talents Program",
      type: "Technical Training",
      status: "Open",
      brief: "Free intensive training in software development, AI, data science, and product design.",
      full: "The Ministry of Communications, Innovation and Digital Economy is offering free tech training with placement opportunities. Trainees receive monthly internet allowance and access to physical learning hubs in all 36 states.",
      docs: "NIN validation, secondary school certificate (WAEC/NECO).",
      officerNotes: "Classes are held in cohorts. Select your closest physical hub in your profile page under residence details.",
      actionLabel: "Register for 3MTT Cohort",
    },
    {
      id: "op12",
      title: "Renewed Hope Artisan Skill Training Initiative",
      type: "Artisan Certification",
      status: "Open",
      brief: "Certified vocational training in solar installation, fashion design, and auto-mechanics.",
      full: "A 3-month fully funded vocational program aiming to empower youths with practical trade skills. At graduation, participants receive a certified trade test license and a business startup toolkit.",
      docs: "WAEC or primary school leaving certificate, passport photo.",
      officerNotes: "Toolkits are distributed upon 90% attendance. Your field officer will perform weekly spot checks.",
      actionLabel: "Claim Training Seat",
    },
  ],
};

export const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    id: "op_def",
    title: "CitiEye National Civic Welfare Support Program",
    type: "General Welfare Program",
    status: "Open",
    brief: "Access to community-level food vouchers, education, and medical checkups.",
    full: "General citizen support program providing community welfare packages. Vouchers can be redeemed for groceries, school books, or primary health center visits.",
    docs: "CitiEye citizen code, State residency certificate.",
    officerNotes: "Please complete your NIN profile details to qualify for targeted tier-2 programs.",
    actionLabel: "Claim General Support Voucher",
  },
];

export const INITIAL_KPI_CHECKLIST: KpiItem[] = [
  { id: "kpi1", label: "Register for Permanent Voter's Card (PVC)", completed: true, points: 20 },
  { id: "kpi2", label: "Link National Identification Number (NIN) to Citizen Profile", completed: true, points: 15 },
  { id: "kpi3", label: "Attend Ward Community Town Hall Meeting (Virtual or Physical)", completed: false, points: 30 },
  { id: "kpi4", label: "Complete Yearly Basic Health Assessment at Federal Center", completed: false, points: 25 },
  { id: "kpi5", label: "Submit Neighborhood Safety Feedback Form", completed: false, points: 10 },
];

export const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: "comp1",
    title: "Delayed waste clearance on Herbert Macaulay Way",
    category: "Sanitation & Environment",
    description: "Waste bins are overflowing, causing health hazards for shop owners and pedestrians.",
    status: "Resolved",
    date: "2 days ago",
  },
  {
    id: "comp2",
    title: "Frequent grid failure at local transformer",
    category: "Power Infrastructure",
    description: "Local distribution transformer sparks weekly, causing sudden outages in Zone 3.",
    status: "In Review",
    date: "5 days ago",
  },
];
