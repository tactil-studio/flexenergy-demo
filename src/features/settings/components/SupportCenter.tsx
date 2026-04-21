import { HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconBox } from "@/components/ui/icon-box";

const SUPPORT_ITEMS = [
  {
    icon: HelpCircle,
    title: "Knowledge Base",
    description: "Detailed guides on managing consumption and billing cycles.",
  },
  {
    icon: MessageSquare,
    title: "Direct Support",
    description: "24/7 technical assistance for meter connection issues.",
  },
] as const;

export function SupportCenter() {
  return (
    <section className="mb-4 md:mb-10">
      <h2 className="font-bold text-base md:text-xl mb-3 md:mb-6 px-2 text-foreground">
        Support Center
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 list-none p-0">
        {SUPPORT_ITEMS.map(({ icon: Icon, title, description }) => (
          <li key={title}>
            <Button
              variant="ghost"
              className="w-full h-auto text-left flex-col items-start gap-2 md:gap-4 bg-card p-4 md:p-6 rounded-[20px] md:rounded-[32px] border border-border shadow-sm hover:bg-muted/30 group"
            >
              <IconBox
                variant="primary"
                size="lg"
                className="group-hover:scale-110 transition-transform"
              >
                <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-primary" />
              </IconBox>
              <div>
                <h3 className="font-semibold text-xs md:text-base text-foreground mb-0.5">
                  {title}
                </h3>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed font-normal">
                  {description}
                </p>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
