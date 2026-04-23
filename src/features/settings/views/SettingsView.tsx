import { AlertSection } from "../components/AlertSection";
import { ExportsSection } from "../components/ExportsSection";
import { ProfileHero } from "../components/ProfileHero";
import { SettingsList } from "../components/SettingsList";
import { SupportCenter } from "../components/SupportCenter";

export function SettingsView() {
  return (
    <div className="space-y-0 pt-4 lg:pt-6">
      <ProfileHero />
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div className="space-y-0">
          <AlertSection />
          <SettingsList />
        </div>
        <aside className="space-y-0">
          <ExportsSection />
          <SupportCenter />
        </aside>
      </div>
    </div>
  );
}
