import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { CaseRoute } from "@/components/expediente/CaseRoute";

export const metadata = {
  title: "Caso 002 · Miguel & Rocío",
  description: "El caso del 18 de noviembre.",
};

export default function Caso002Page() {
  return (
    <SiteConfigProvider>
      <CaseRoute />
    </SiteConfigProvider>
  );
}
