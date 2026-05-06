'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const WhatsAppSVG = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378L2.01 5.387l1.024 3.962A9.868 9.868 0 002 12.001c0 5.514 4.486 10 10 10s10-4.486 10-10-4.486-10-10-10z"/>
  </svg>
);

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '8292244709';
  const message = 'Hello! I would like to know more about your services ';

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        {/* Chat bubble */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl p-4 w-80 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <WhatsAppSVG className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Adyapan Support</p>
                  <p className="text-xs text-gray-500">Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-sm text-gray-700">
                Hi there! 👋 How can we help you today? Feel free to ask us anything about our courses and services.
              </p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <WhatsAppSVG className="w-5 h-5" />
              Chat on WhatsApp
            </button>
          </div>
        )}

        {/* Main WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative"
          title="Chat with us on WhatsApp"
        >
          <WhatsAppSVG className="w-8 h-8" />
          <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-40 -z-10" />
        </button>

        {/* Guide Me Button */}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdGRHq4JezcLp-RpU1yFzgTm1lfiyU4Yii3mMlLCuM-0sTc3Q/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 hover:from-orange-500 hover:via-orange-600 hover:to-amber-600 text-white font-bold rounded-full shadow-2xl transition-all duration-300 border-4 border-orange-300 hover:border-orange-400 group whitespace-nowrap"
          title="Talk with us - Fill the form"
        >
          <svg className="w-6 h-6 group-hover:scale-125 transition-transform flex-shrink-0" fill="white" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <span className="text-lg">Guide Me 🚀</span>
        </a>
      </div>
    </>
  );
}