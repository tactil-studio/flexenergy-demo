import { ChevronRight, CreditCard, Lock, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function SettingsList() {
  const { logout } = useAuth();

  return (
    <section className="mb-4 md:mb-10">
      <div className="bg-white rounded-[20px] md:rounded-[32px] p-1 md:p-2 border border-slate-50 shadow-sm">
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 md:gap-4">
            <Lock className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-400" />
            <span className="font-bold text-xs md:text-base text-slate-700">
              Privacy & Security
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-300" />
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 md:gap-4">
            <CreditCard className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-400" />
            <span className="font-bold text-xs md:text-base text-slate-700">
              Payment Methods
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-300" />
        </button>
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-red-50 group transition-colors"
        >
          <div className="flex items-center gap-2.5 md:gap-4">
            <LogOut className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-500" />
            <span className="font-bold text-xs md:text-base text-red-500">
              Log out
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
