import { UserPlus, Fingerprint, Coins } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      name: "Create a Profile",
      description: "Sign up securely using basic demographic information. We only ask for what's necessary to identify your needs.",
      icon: UserPlus,
    },
    {
      name: "Get Verified",
      description: "Our system safely verifies your eligibility based on age, gender, economic status, and geographic location.",
      icon: Fingerprint,
    },
    {
      name: "Receive Assistance",
      description: "Get automatically matched with welfare programs you qualify for, and start receiving targeted help immediately.",
      icon: Coins,
    },
  ];

  return (
    <div id="how-it-works" className="py-24 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-700 uppercase tracking-wide">Simple Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            How CitiEye Community Governance Works for You
          </p>
          <p className="mt-6 text-lg leading-8 text-stone-600">
            Getting the support you need shouldn't be complicated. We've streamlined the registration process to get you matched with government and NGO programs faster.
          </p>
        </div>

        <div className="mt-20 mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 relative">
            {/* Connecting line for desktop */}
            <div className="hidden sm:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-stone-200 z-0"></div>

            {steps.map((step, stepIdx) => (
              <div key={step.name} className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 border-4 border-white shadow-lg">
                  <step.icon className="h-10 w-10 text-amber-600" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold leading-7 text-stone-900 mb-3">
                  {stepIdx + 1}. {step.name}
                </h3>
                <p className="text-base leading-7 text-stone-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
