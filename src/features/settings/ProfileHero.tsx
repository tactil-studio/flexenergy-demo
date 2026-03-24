import { Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function ProfileHero() {
  const { state } = useApp();
  const user = state?.user;

  if (!user) return null;

  return (
    <section className="mb-4 md:mb-10">
      <div className="bg-white rounded-[20px] md:rounded-[32px] p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center relative overflow-hidden border border-slate-50 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        <div className="flex-1 z-10">
          <h1 className="font-bold text-xl md:text-3xl tracking-tight mb-0.5 text-slate-900">
            {user.name}
          </h1>
          <p className="text-xs md:text-base text-slate-500 mb-3 font-medium">
            {user.plan} • {user.zone}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-blue-50 text-blue-600 text-[9px] md:text-[11px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wider">
              {user.status} Account
            </span>
            {user.isVerified && (
              <span className="bg-slate-100 text-slate-600 text-[9px] md:text-[11px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-wider">
                Verified Meter
              </span>
            )}
          </div>
        </div>
        <div className="w-full md:w-auto z-10">
          <div className="bg-slate-50 p-3 md:p-5 rounded-lg md:rounded-2xl border border-slate-100">
            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.05em] text-slate-500 font-bold block mb-1.5">
              Primary Device
            </span>
            <div className="flex items-center gap-2 md:gap-3">
              <Zap className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-600 fill-blue-600" />
              <code className="font-mono text-[10px] md:text-sm font-bold tracking-tight text-slate-800">
                {user.deviceId}
              </code>
            </div>
            <div className="mt-1.5 md:mt-3 flex items-center gap-1.5">
              <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] md:text-xs font-semibold text-slate-600">
                Connected & Syncing
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
