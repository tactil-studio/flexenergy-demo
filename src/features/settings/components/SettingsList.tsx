import { ChevronRight, CreditCard, Lock, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function SettingsList() {
  const { logout } = useAuth();

  return (
    <section className="mb-4 md:mb-10">
      <ul className="bg-card rounded-[20px] md:rounded-[32px] p-1 md:p-2 border border-border shadow-sm list-none">
        <li>
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-muted/40 transition-colors"
          >
            <span className="flex items-center gap-2.5 md:gap-4">
              <Lock className="w-3.5 h-3.5 md:w-5 md:h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium text-xs md:text-base text-foreground">
                Privacy & Security
              </span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-muted-foreground/50" aria-hidden="true" />
          </button>
        </li>
        <li>
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-muted/40 transition-colors"
          >
            <span className="flex items-center gap-2.5 md:gap-4">
              <CreditCard className="w-3.5 h-3.5 md:w-5 md:h-5 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium text-xs md:text-base text-foreground">
                Payment Methods
              </span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-muted-foreground/50" aria-hidden="true" />
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-destructive/5 group transition-colors"
          >
            <span className="flex items-center gap-2.5 md:gap-4">
              <LogOut className="w-3.5 h-3.5 md:w-5 md:h-5 text-destructive" aria-hidden="true" />
              <span className="font-medium text-xs md:text-base text-destructive">
                Log out
              </span>
            </span>
          </button>
        </li>
      </ul>
    </section>
  );
}
