"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Define routes where footer should be hidden
  const hideOnRoutes = ["/admin", "/dashboard", "/team"];
  
  // Check if current path starts with any of the hidden routes
  const shouldHide = hideOnRoutes.some(route => pathname?.startsWith(route));

  if (shouldHide) return null;

  return (
    <footer className="bg-[#0A0A0F] w-full border-t border-white/5 pt-12 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <div className="text-xl font-bold text-[#00D4FF] mb-4 font-headline">
            Aster Tech Hub
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Pioneering the next generation of digital infrastructure and creative
            marketing from the heart of India.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-500 hover:text-[#00D4FF] cursor-pointer transition-colors">
              language
            </span>
            <span className="material-symbols-outlined text-slate-500 hover:text-[#00D4FF] cursor-pointer transition-colors">
              hub
            </span>
            <span className="material-symbols-outlined text-slate-500 hover:text-[#00D4FF] cursor-pointer transition-colors">
              terminal
            </span>
          </div>
        </div>

        {/* Solutions Column */}
        <div>
          <h6 className="text-white font-bold mb-6 text-sm uppercase tracking-widest font-headline">
            Solutions
          </h6>
          <ul className="space-y-4 text-sm font-headline">
            <li>
              <Link href="/services" className="text-slate-500 hover:text-[#00D4FF] transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-slate-500 hover:text-[#00D4FF] transition-colors">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/digital-strategy" className="text-slate-500 hover:text-[#00D4FF] transition-colors">
                Digital Strategy
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h6 className="text-white font-bold mb-6 text-sm uppercase tracking-widest font-headline">
            Company
          </h6>
          <ul className="space-y-4 text-sm font-headline">
            <li>
              <Link href="/about" className="text-slate-500 hover:text-[#00D4FF] transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/consultation" className="text-slate-500 hover:text-[#00D4FF] transition-colors">
                Consultation
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-slate-500 hover:text-[#00D4FF] transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect Column */}
        <div>
          <h6 className="text-white font-bold mb-6 text-sm uppercase tracking-widest font-headline">
            Connect
          </h6>
          <p className="text-sm text-slate-500 mb-4">Davangere, India.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-500 hover:text-[#00D4FF] cursor-pointer transition-colors">
              public
            </span>
            <span className="material-symbols-outlined text-slate-500 hover:text-[#00D4FF] cursor-pointer transition-colors">
              mail
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest opacity-80 hover:opacity-100 font-headline transition-opacity">
        <div className="text-slate-400">© 2025 Aster Tech Hub. Davangere, India.</div>
        <div className="text-[#00D4FF]">Designed for the Frontier</div>
      </div>
    </footer>
  );
}
