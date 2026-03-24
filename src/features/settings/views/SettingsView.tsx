import { AlertSection } from "../components/AlertSection";
import { ProfileHero } from "../components/ProfileHero";
import { SettingsList } from "../components/SettingsList";
import { SupportCenter } from "../components/SupportCenter";

export function SettingsView() {
  return (
    <>
      <ProfileHero />
      <AlertSection />
      <SupportCenter />
      <SettingsList />
    </>
  );
}
