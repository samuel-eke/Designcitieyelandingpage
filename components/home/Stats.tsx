export function Stats() {
  const stats = [
    { label: "Active Programs", value: "45+" },
    { label: "Communities Reached", value: "3,200" },
    { label: "Funds Distributed (2025)", value: "$120M" },
    { label: "Citizen Satisfaction", value: "94%" },
  ];

  return (
    <div className="bg-emerald-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Transparency in Action
          </h2>
          <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
            We believe in complete transparency. Every citizen has the right to know how welfare programs are making an impact across the nation.
          </p>
        </div>
        
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-emerald-200">{stat.label}</dt>
              <dd className="order-first text-5xl font-semibold tracking-tight text-amber-400 sm:text-6xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
