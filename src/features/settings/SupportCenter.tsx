import { HelpCircle, MessageSquare } from "lucide-react";

export function SupportCenter() {
  return (
    <section className="mb-4 md:mb-10">
      <h2 className="font-bold text-base md:text-xl mb-3 md:mb-6 px-2 text-slate-900">
        Support Center
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white p-4 md:p-6 rounded-[20px] md:rounded-[32px] border border-slate-50 shadow-sm hover:bg-slate-50 transition-colors group cursor-pointer">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-600" />
          </div>
          <h3 className="font-bold text-xs md:text-base text-slate-900 mb-0.5">Knowledge Base</h3>
          <p className="text-[9px] md:text-xs text-slate-500 font-medium leading-relaxed">
            Detailed guides on managing consumption and billing cycles.
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-[20px] md:rounded-[32px] border border-slate-50 shadow-sm hover:bg-slate-50 transition-colors group cursor-pointer">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-600" />
          </div>
          <h3 className="font-bold text-xs md:text-base text-slate-900 mb-0.5">Direct Support</h3>
          <p className="text-[9px] md:text-xs text-slate-500 font-medium leading-relaxed">
            24/7 technical assistance for meter connection issues.
          </p>
        </div>
      </div>
    </section>
  );
}
