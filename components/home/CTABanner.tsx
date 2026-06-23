import { Check, Smartphone } from "lucide-react";

export function CTABanner() {
  return (
    <div id="download" className="w-full bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="text-[10px] font-semibold tracking-[2px] uppercase text-blue-600 mb-3 block">
            Get started today
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4 leading-tight">
            Join the CitiEye Programme
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            Registration is free and open to all citizens. Choose how you'd like to begin your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Register Card */}
          <div className="relative bg-stone-900 rounded-2xl p-8 overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-[20%] -left-8 w-32 h-16 bg-green-600/40 z-0 transform -rotate-12 blur-md rounded-full"></div>

            <div className="relative z-10">
              <span className="text-[10px] font-semibold tracking-[2px] uppercase text-[#FFD100] mb-4 block">
                Online Registration
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mb-3 leading-tight">
                Create your CitiEye profile today
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed font-light mb-6">
                Sign up in minutes and gain immediate access to your personalised programme dashboard, a dedicated officer, and resources tailored to your life stage.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 text-[11px] text-stone-300">
                  <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
                  Free to join
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-300">
                  <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
                  Takes under 3 minutes
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-300">
                  <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2.5} />
                  No documents required to start
                </div>
              </div>

              <button className="bg-white text-stone-900 px-6 py-3 text-[13px] font-semibold tracking-wide transition-all hover:bg-stone-100 hover:shadow-lg rounded-lg">
                Register Now — It's Free
              </button>
            </div>
          </div>

          {/* Download App Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8">
            <span className="text-[10px] font-semibold tracking-[2px] uppercase text-blue-600 mb-4 block">
              Mobile App
            </span>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3 leading-tight">
              Your CitiEye, right in your pocket
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light mb-6">
              Download the CitiEye app to access your programme, connect with your dedicated officer, receive health reminders, and track your progress — anytime, anywhere.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-6">
              <Smartphone className="w-3.5 h-3.5" strokeWidth={2} />
              Available on iOS and Android
            </div>

            {/* App Store Badges */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 bg-white border border-stone-200 rounded-lg hover:border-stone-400 transition-all group"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[9px] text-stone-500 leading-none">Download on the</div>
                  <div className="text-[13px] font-semibold text-stone-900 leading-tight">App Store</div>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 bg-white border border-stone-200 rounded-lg hover:border-stone-400 transition-all group"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m3.18 23.76.02-.01 10.79-6.06-2.38-2.38zM.5 1.4C.18 1.7 0 2.17 0 2.77v18.44c0 .6.18 1.07.51 1.36l.07.07L11.2 12l-.07-.07zM20.49 9.29l-2.78-1.56-2.67 2.67 2.67 2.67 2.79-1.57c.8-.45.8-1.19 0-1.64zm-17.3-7.53 10.38 10.39-2.38 2.38 10.8 6.07.02.01z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[9px] text-stone-500 leading-none">Get it on</div>
                  <div className="text-[13px] font-semibold text-stone-900 leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
