import React from 'react';
import { Heart, HelpCircle, Calculator, FileText, Truck, ClipboardCheck, Sparkles } from 'lucide-react';
import { useCOAPageSetting } from '../hooks/useCOAPageSetting';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { coaPageEnabled } = useCOAPageSetting();

  return (
    <footer className="bg-cream-200 border-t border-gold-200/50 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">

          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-gold-300 shadow-glow">
                <img
                  src="/assets/logo.jpg"
                  alt="Glowform Lab"
                  className="w-full h-full object-cover"
                />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-gold-400 animate-sparkle" />
            </div>
            <div className="text-left">
              <div className="font-bold text-caramel-600 text-lg tracking-tight font-playfair">
                Glowform Lab
              </div>
              <div className="text-xs text-caramel-400 font-poppins">Where Science Meets Sparkle ✨</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
            <a
              href="/track-order"
              className="text-caramel-500 hover:text-gold-500 transition-colors flex items-center gap-2 text-sm font-medium font-poppins"
            >
              <Truck className="w-4 h-4" />
              Track Order
            </a>
            <a
              href="/calculator"
              className="text-caramel-500 hover:text-gold-500 transition-colors flex items-center gap-2 text-sm font-medium font-poppins"
            >
              <Calculator className="w-4 h-4" />
              Calculator
            </a>
            {coaPageEnabled && (
              <a
                href="/coa"
                className="text-caramel-500 hover:text-gold-500 transition-colors flex items-center gap-2 text-sm font-medium font-poppins"
              >
                <FileText className="w-4 h-4" />
                Lab Tests
              </a>
            )}
            <a
              href="/faq"
              className="text-caramel-500 hover:text-gold-500 transition-colors flex items-center gap-2 text-sm font-medium font-poppins"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </a>
            <a
              href="/assessment"
              className="text-caramel-500 hover:text-gold-500 transition-colors flex items-center gap-2 text-sm font-medium font-poppins"
            >
              <ClipboardCheck className="w-4 h-4" />
              Assessment
            </a>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gold-200/50 pt-6 text-center">
          <p className="text-xs text-caramel-400 flex items-center justify-center gap-1 font-poppins">
            Made with
            <Heart className="w-3 h-3 text-blush-400 fill-blush-400" />
            © {currentYear} Glowform Lab. Where science meets sparkle ✨
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
