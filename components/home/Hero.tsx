import { CulturalPattern } from "../ui/CulturalPattern";

export function Hero() {
  return (
    <div className="relative w-full bg-white pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-visible">
      {/* Cultural Pattern Background */}
      <CulturalPattern opacity={0.03} />

      {/* Abstract map/shape background in light brown/tan */}
      <div className="absolute top-0 right-0 w-3/4 h-[800px] pointer-events-none z-0">
        <svg viewBox="0 0 800 800" className="w-full h-full text-[#EFEBE4] fill-current opacity-70" preserveAspectRatio="none">
          <path d="M400,0 C600,0 800,200 800,400 C800,600 600,800 400,800 C200,800 0,600 0,400 C0,200 200,0 400,0 Z" 
                style={{ transform: "scale(1.5) translate(10%, -20%)" }} />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="max-w-xl">
            <div className="inline-block mb-4 px-4 py-1.5 bg-stone-100 border border-stone-200 rounded-full text-[20px]">
              <span className="text-[10px] font-semibold tracking-[2px] uppercase text-stone-600">
                A Lifelong Commitment to Every Citizen
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[72px] leading-[1.1] font-serif font-bold text-stone-900 tracking-tight">
              The Programme <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 italic">That Grows</span>
                <span className="absolute bottom-1 sm:bottom-2 left-0 w-[105%] h-4 sm:h-6 bg-[#FFD100] -z-10 transform -rotate-1 rounded-sm"></span>
              </span> <br />
              With You
            </h1>

            <p className="mt-8 text-stone-600 max-w-md leading-relaxed font-light text-[20px]">
              From your earliest years to your golden ones, CitiEye walks alongside you — delivering personalised care, opportunity, and support at every stage of life.
            </p>

            <div className="mt-10 flex items-center gap-6 flex-wrap">
              <button className="bg-black px-8 py-4 text-[13px] font-semibold tracking-wide text-white transition-all hover:bg-stone-800 text-[#ffffff]">
                Register for Free
              </button>
              <button className="text-[13px] font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-2 group">
                Download the App <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>

            {/* Hero Stats */}
            <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-serif font-bold text-stone-900">36</div>
                <div className="text-stone-500 font-medium tracking-wide uppercase mt-1 text-[11px]">States Covered</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-stone-900">4</div>
                <div className="text-stone-500 font-medium tracking-wide uppercase mt-1 text-[11px]">Life Stage Programmes</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-stone-900 px-[30px] py-[0px]">1:1</div>
                <div className="text-stone-500 font-medium tracking-wide uppercase mt-1 text-[11px] px-[23px] py-[0px]">Dedicated Officer Support</div>
              </div>
            </div>
          </div>
          
          {/* Right Image Composition */}
          <div className="relative mt-12 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[450px] aspect-[4/5]">
              {/* Organic Image Masking */}
              <div 
                className="absolute inset-0 bg-stone-200"
                style={{
                  clipPath: "polygon(10% 0%, 95% 5%, 100% 90%, 5% 100%)",
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1761370981139-c1fe5402c709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFtaWx5JTIwb3V0c2lkZXxlbnwxfHx8fDE3Nzg2NjQ5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Citizen looking forward"
                  className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]"
                />
              </div>

              {/* Decorative green brush stroke behind */}
              <div className="absolute top-[20%] -left-8 w-32 h-12 bg-green-700/80 -z-10 transform -rotate-12 blur-[2px] rounded-full"></div>
              
              {/* Decorative yellow brush stroke overlay */}
              <div className="absolute bottom-[20%] -right-12 w-48 h-16 bg-[#FFD100]/90 z-20 transform -rotate-6 blur-[1px] rounded-full flex items-center justify-center flex-col shadow-sm">
                <span className="text-3xl font-serif font-bold text-stone-900 leading-none">1.2M</span>
                <span className="text-[10px] text-stone-900 font-medium tracking-wide uppercase mt-1">Citizens Helped</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
