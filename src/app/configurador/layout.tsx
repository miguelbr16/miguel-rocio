import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { ConfiguradorWizard } from "@/components/configurador/ConfiguradorWizard";

export default function ConfiguradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteConfigProvider>
      {children}
    </SiteConfigProvider>
  );
}
