import { Heart, Home, BookOpen, Stethoscope } from "lucide-react";

export function Pillars() {
  const pillars = [
    {
      title: "Healthcare Access",
      description: "Subsidized medical care, maternal support, and routine checkups for eligible families and seniors.",
      icon: Stethoscope,
      color: "bg-rose-100 text-rose-700",
      image: "https://images.unsplash.com/photo-1770221798098-d8a7f7517f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjB3b3JrZXIlMjBoZWxwaW5nfGVufDF8fHx8MTc3ODY2NDk5MXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Family & Housing Relief",
      description: "Emergency shelter, rent assistance, and food security programs to keep families safe and together.",
      icon: Home,
      color: "bg-amber-100 text-amber-700",
      image: "https://images.unsplash.com/photo-1761370981139-c1fe5402c709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFtaWx5JTIwb3V0c2lkZXxlbnwxfHx8fDE3Nzg2NjQ5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Youth Education & Training",
      description: "Scholarships, skill-building workshops, and vocational training to empower the next generation.",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-700",
      image: "https://images.unsplash.com/photo-1775172990682-8ce567219704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMG9mJTIwZGl2ZXJzZSUyMHBlb3BsZXxlbnwxfHx8fDE3Nzg2NjQ5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <div id="programs" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-stone-50 mix-blend-multiply opacity-50" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="md:flex md:items-end md:justify-between mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Targeted Programs for Every Need
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              Our support is categorized based on comprehensive community needs. By registering, you'll be matched with the specific pillars of support you qualify for.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <button className="text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-2 group">
              View all programs 
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="group relative flex flex-col rounded-3xl bg-stone-50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={pillar.image} 
                  alt={pillar.title} 
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className={`inline-flex items-center justify-center p-3 rounded-2xl w-12 h-12 mb-6 ${pillar.color}`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{pillar.title}</h3>
                <p className="text-stone-600 flex-1">{pillar.description}</p>
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <a href="#" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
