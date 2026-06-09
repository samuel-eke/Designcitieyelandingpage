import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CulturalPattern } from "../ui/CulturalPattern";

const chartData = [
  { year: "2021", citizens: 120, funds: 15 },
  { year: "2022", citizens: 350, funds: 45 },
  { year: "2023", citizens: 680, funds: 80 },
  { year: "2024", citizens: 950, funds: 110 },
  { year: "2025", citizens: 1250, funds: 150 },
  { year: "2026", citizens: 1800, funds: 210 },
];

function AnimatedCounter({ value, duration = 2.5, suffix = "", prefix = "", decimals = 0 }: { value: number, duration?: number, suffix?: string, prefix?: string, decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration, ease: "easeOut" });
    }
  }, [isInView, value, count, duration]);

  return (
    <span ref={ref} className="inline-flex">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function Impact() {
  const [activeMetric, setActiveMetric] = useState<"citizens" | "funds">("citizens");

  return (
    <div className="relative w-full bg-white py-24 lg:py-32 overflow-hidden border-t border-stone-100">
      <CulturalPattern opacity={0.02} />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-green-700 mb-6 block">
            Measured Impact
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-[1.15]">
            Real change, <br className="hidden sm:block" />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 italic">by the numbers</span>
              <span className="absolute bottom-1 sm:bottom-2 left-0 w-[105%] h-3 sm:h-4 bg-[#FFD100] -z-10 transform -rotate-1"></span>
            </span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-stone-600 font-light leading-relaxed">
            CitiEye's commitment isn't just a promise—it's a measurable reality. Track our nationwide progress and see how our digital welfare platform is uplifting communities every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-x-6 gap-y-12">
            <div className="flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
                <AnimatedCounter value={1.8} decimals={1} suffix="M+" />
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500">Citizens Supported</div>
              <div className="h-[2px] w-8 bg-green-600 mt-2" />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
                <AnimatedCounter value={36} />
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500">States Reached</div>
              <div className="h-[2px] w-8 bg-[#FFD100] mt-2" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
                <AnimatedCounter value={210} prefix="₦" suffix="B" />
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500">Funds Disbursed</div>
              <div className="h-[2px] w-8 bg-black mt-2" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
                <AnimatedCounter value={94} suffix="%" />
              </div>
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500">Satisfaction Rate</div>
              <div className="h-[2px] w-8 bg-green-600 mt-2" />
            </div>
            
            <div className="col-span-2 mt-4 p-6 bg-stone-50 border border-stone-100 rounded-2xl relative overflow-hidden">
              <CulturalPattern opacity={0.04} className="mix-blend-multiply" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFD100] flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Real-time Verification</h4>
                  <p className="text-stone-600 text-xs mt-1 font-light">All data is authenticated via the National Identity Management Commission (NIMC).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Chart */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-stone-200 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Platform Growth</h3>
                <p className="text-sm text-stone-500 font-light mt-1">Cumulative impact over time</p>
              </div>
              
              {/* Custom Tab Switcher */}
              <div className="flex bg-stone-100 p-1 rounded-full">
                <button
                  onClick={() => setActiveMetric("citizens")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    activeMetric === "citizens" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Citizens (Thousands)
                </button>
                <button
                  onClick={() => setActiveMetric("funds")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    activeMetric === "funds" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Funds (Billions ₦)
                </button>
              </div>
            </div>

            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorGradient-citizens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorGradient-funds" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#facc15" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e4" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716c', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#78716c', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: '#d6d3d1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    key={activeMetric}
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={activeMetric === "citizens" ? "#16a34a" : "#facc15"}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={`url(#colorGradient-${activeMetric})`}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Brush stroke aesthetic addition */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-600/10 rounded-full blur-xl -z-10 pointer-events-none"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl -z-10 pointer-events-none"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
