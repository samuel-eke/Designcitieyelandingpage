export function Stories() {
  const stories = [
    {
      name: "Adaobi",
      age: "68 years",
      programme: "Seniors Programme",
      image: "https://images.unsplash.com/photo-1496672254107-b07a26403885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwbmlnZXJpYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3ODg0ODgwMnww&ixlib=rb-4.1.0&q=80&w=1080",
      testimonial: "CitiEye Community Governance has given me dignity in my golden years. My dedicated officer visits monthly and ensures I receive home care and help with utilities. I no longer worry about being alone."
    },
    {
      name: "Chinedu",
      age: "14 years",
      programme: "Childhood Programme",
      image: "https://images.unsplash.com/photo-1602342323893-b11f757957c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMHRlZW5hZ2VyJTIwMTQlMjB5ZWFycyUyMGNoaWxkJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc4ODQ4ODAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      testimonial: "Through the aptitude tests, they discovered I have a gift for mathematics. Now I receive specialized tutoring and they're helping me prepare for university. My future looks bright!"
    },
    {
      name: "Ngozi",
      age: "28 years",
      programme: "Youth & Families Programme",
      image: "https://images.unsplash.com/photo-1710897872898-3bc4353682ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVnbmFudCUyMG5pZ2VyaWFuJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3Nzg4NDg4MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      testimonial: "As an expectant mother, CitiEye Community Governance connected me with prenatal care and nutritional support. My officer guided me through every step and made sure my baby and I stayed healthy throughout."
    },
    {
      name: "Emeka",
      age: "32 years",
      programme: "Adulthood Programme",
      image: "https://images.unsplash.com/photo-1533108344127-a586d2b02479?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx5b3VuZyUyMG5pZ2VyaWFuJTIwYWR1bHQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Nzg4NDg4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      testimonial: "CitiEye Community Governance helped me start my own tailoring business. They provided skills training, connected me with mentors, and gave me the confidence to pursue my entrepreneurial dreams."
    }
  ];

  return (
    <div className="w-full bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-[1.2] max-w-sm">
            Learn <span className="relative inline-block">
              <span className="relative z-10">the stories</span>
              <span className="absolute bottom-1 left-0 w-full h-2 bg-[#FFD100] -z-10 transform -rotate-1"></span>
            </span> of those we've already helped
          </h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-400 transition-all">
              ←
            </button>
            <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-400 transition-all">
              →
            </button>
          </div>
        </div>

        {/* Story Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stories.map((story, idx) => (
            <div key={idx} className="group relative">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 mb-6 rounded-lg">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />

                {/* Testimonial Overlay - shown on hover */}
                <div className="absolute inset-0 bg-stone-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                  <p className="text-white text-[13px] leading-relaxed font-light text-center">
                    "{story.testimonial}"
                  </p>
                </div>

                {/* Decorative stroke on first item */}
                {idx === 0 && (
                  <div className="absolute top-4 -left-4 w-16 h-6 bg-green-700/80 transform -rotate-12 blur-[1px] rounded-full z-10"></div>
                )}
                {/* Decorative stroke on last item */}
                {idx === 3 && (
                  <div className="absolute bottom-12 -right-4 w-20 h-8 bg-[#FFD100]/90 transform rotate-12 blur-[1px] rounded-full z-10"></div>
                )}
              </div>

              <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">{story.name}</h3>
              <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">{story.age}</p>
              <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                {story.programme}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
