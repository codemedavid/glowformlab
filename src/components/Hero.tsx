import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Truck, Clock, Sparkles, Heart, Award, Star } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeroProps {
  onShopAll: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopAll }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Use settings or fallbacks if loading/missing
  const badgeText = siteSettings?.hero_badge_text || 'Magical Wellness Science ✨';
  const description = siteSettings?.hero_description || 'Where science meets sparkle — wellness designed to help you glow with confidence. Premium peptides and wellness solutions crafted for your transformation journey.';

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-br from-cream-200 via-cream-100 to-peach-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top gradient bar - golden */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold-400 via-gold-300 to-peach-300" />

        {/* Floating orbs - warm tones */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-gradient-to-br from-gold-300/30 to-gold-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 left-[5%] w-56 h-56 bg-gradient-to-br from-peach-300/30 to-blush-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-[20%] w-64 h-64 bg-gradient-to-br from-blush-200/20 to-peach-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-tr from-gold-400/15 to-transparent rounded-full blur-3xl" />

        {/* Sparkle decorations */}
        <div className="absolute top-[15%] left-[20%] text-gold-400 animate-sparkle text-2xl">✨</div>
        <div className="absolute top-[25%] right-[15%] text-gold-300 animate-sparkle text-xl" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute bottom-[30%] left-[10%] text-blush-300 animate-sparkle text-lg" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-[60%] right-[25%] text-gold-400 animate-sparkle" style={{ animationDelay: '1.5s' }}>✨</div>

        {/* Soft grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(244,194,79,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,194,79,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 z-10">
        <div className="max-w-5xl mx-auto">

          {/* Content */}
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gold-200 shadow-glow">
                <Sparkles className="w-5 h-5 text-gold-500 animate-sparkle" />
                <span className="text-sm font-bold tracking-wide uppercase text-gold-600 font-poppins">
                  {badgeText}
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 font-playfair">
                <span className="text-caramel-600">The New Improved </span>
                <span className="relative inline-block">
                  <span className="text-gradient-gold">
                    You
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8 Q50 2 100 8 T198 8" stroke="url(#underline-gradient)" strokeWidth="4" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F4C24F" />
                        <stop offset="100%" stopColor="#E3AE3A" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br className="hidden sm:block" />
                <span className="text-caramel-600">Designed for Your Glow-Up Era</span>
              </h1>

              <p className="text-lg md:text-xl text-caramel-500 max-w-2xl mx-auto leading-relaxed font-poppins">
                {description}
              </p>
            </div>

            {/* Decorative element */}
            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-300" />
                <Star className="w-5 h-5 text-gold-400 animate-sparkle" />
                <Sparkles className="w-6 h-6 text-gold-500" />
                <Star className="w-5 h-5 text-gold-400 animate-sparkle" style={{ animationDelay: '0.5s' }} />
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-300" />
              </div>
            </div>

            {/* Feature Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
              <div className="group flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-gold-100 shadow-soft hover:shadow-glow hover:border-gold-200 transition-all duration-300 hover:-translate-y-1">
                <div className="p-2.5 bg-gradient-to-br from-gold-400 to-gold-500 rounded-2xl text-white shadow-glow group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-caramel-600 text-sm font-poppins">Science-Backed</p>
                  <p className="text-xs text-caramel-400 font-poppins">Lab Tested Quality</p>
                </div>
              </div>

              <div className="group flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-blush-100 shadow-soft hover:shadow-glow hover:border-blush-200 transition-all duration-300 hover:-translate-y-1">
                <div className="p-2.5 bg-gradient-to-br from-blush-300 to-blush-400 rounded-2xl text-white shadow-lg shadow-blush-300/30 group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-caramel-600 text-sm font-poppins">Self-Care First</p>
                  <p className="text-xs text-caramel-400 font-poppins">Your Glow-Up Journey</p>
                </div>
              </div>

              <div className="group flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-peach-100 shadow-soft hover:shadow-glow hover:border-peach-200 transition-all duration-300 hover:-translate-y-1">
                <div className="p-2.5 bg-gradient-to-br from-peach-300 to-gold-400 rounded-2xl text-white shadow-lg shadow-peach-300/30 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-caramel-600 text-sm font-poppins">Community Trusted</p>
                  <p className="text-xs text-caramel-400 font-poppins">Join Our Glow Fam</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={onShopAll}
                className="group relative px-10 py-5 bg-gradient-to-r from-gold-400 to-gold-500 text-caramel-700 rounded-3xl font-bold text-lg shadow-glow-lg hover:shadow-glow hover:from-gold-500 hover:to-honey hover:-translate-y-1 transition-all duration-300 overflow-hidden font-poppins"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Start Your Glow Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-gold-200/50">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-caramel-500 font-poppins">
                <div className="p-1.5 bg-gold-100 rounded-xl">
                  <Truck className="w-4 h-4 text-gold-600" />
                </div>
                <span>Fast Shipping</span>
              </div>
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-gold-300 to-transparent" />
              <div className="flex items-center gap-2.5 text-sm font-semibold text-caramel-500 font-poppins">
                <div className="p-1.5 bg-blush-100 rounded-xl">
                  <Clock className="w-4 h-4 text-blush-500" />
                </div>
                <span>24/7 Support</span>
              </div>
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-gold-300 to-transparent hidden sm:block" />
              <div className="flex items-center gap-2.5 text-sm font-semibold text-caramel-500 font-poppins">
                <div className="p-1.5 bg-peach-100 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-gold-600" />
                </div>
                <span>Secure Checkout</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
