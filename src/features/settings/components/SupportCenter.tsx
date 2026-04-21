import { HelpCircle, MessageSquare } from "lucide-react";

export function SupportCenter() {
  return (
    <section className="mb-4 md:mb-10">
      <h2 className="font-bold text-base md:text-xl mb-3 md:mb-6 px-2 text-foreground">
        Support Center
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 list-none p-0">
        <li>
          <button type="button" className="w-full text-left bg-card p-4 md:p-6 rounded-[20px] md:rounded-[32px] border border-border shadow-sm hover:bg-muted/30 transition-colors group cursor-pointer">
            <span className="size-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
              <HelpCircle className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
            </span>
            <h3 className="font-semibold text-xs md:text-base text-foreground mb-0.5">
              Knowledge Base
            </h3>
            <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
              Detailed guides on managing consumption and billing cycles.
            </p>
          </button>
        </li>
        <li>
          <button type="button" className="w-full text-left bg-card p-4 md:p-6 rounded-[20px] md:rounded-[32px] border border-border shadow-sm hover:bg-muted/30 transition-colors group cursor-pointer">
            <span className="size-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
              <MessageSquare className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
            </span>
            <h3 className="font-semibold text-xs md:text-base text-foreground mb-0.5">
              Direct Support
            </h3>
            <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
              24/7 technical assistance for meter connection issues.
            </p>
          </button>
        </li>
      </ul>
    </section>
  );
}
