import Link from "next/link";
import { Utensils, QrCode, BarChart3, ShoppingCart, Smartphone, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50">
      
      {/* Header */}
      <header className="border-b border-orange-100 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <Utensils className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">
              QR Scan & Order
            </span>
          </div>

          <div className="flex gap-4">
            <Link
              href="/signup"
              className="px-6 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Restaurant with{" "}
            <span className="text-orange-500">Digital Ordering</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A complete QR code ordering system for restaurants. Let customers scan, browse, order, and pay instantly—all without WhatsApp.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-lg font-medium transition-colors"
            >
              Start Free Trial
            </Link>

            <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-orange-500 hover:text-orange-500 text-lg font-medium transition-colors">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 my-20">
          
          {[
            {
              icon: <QrCode className="w-12 h-12 text-orange-500 mb-4" />,
              title: "QR Code Ordering",
              desc: "Customers scan a QR code to access menu instantly."
            },
            {
              icon: <ShoppingCart className="w-12 h-12 text-orange-500 mb-4" />,
              title: "Smart Cart & Checkout",
              desc: "Add items and pay via UPI/Card."
            },
            {
              icon: <BarChart3 className="w-12 h-12 text-orange-500 mb-4" />,
              title: "Real-Time Analytics",
              desc: "Track orders and revenue."
            },
            {
              icon: <Smartphone className="w-12 h-12 text-orange-500 mb-4" />,
              title: "Mobile PWA",
              desc: "Works like mobile app."
            },
            {
              icon: <Lock className="w-12 h-12 text-orange-500 mb-4" />,
              title: "Secure Multi-Tenant",
              desc: "Each store data is isolated."
            },
            {
              icon: <Utensils className="w-12 h-12 text-orange-500 mb-4" />,
              title: "Menu Management",
              desc: "Manage items & stock easily."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-xl p-8 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all">
              {feature.icon}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}

        </div>

        {/* Footer */}
        <footer className="text-center mt-20 text-gray-600">
          © 2026 QR Scan & Order System
        </footer>

      </section>
    </div>
  );
}