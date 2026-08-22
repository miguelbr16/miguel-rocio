import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { AppShell } from "@/components/AppShell";

export default function HomePage() {
  return (
    <SiteConfigProvider>
      <AppShell />
    </SiteConfigProvider>
  );
}
