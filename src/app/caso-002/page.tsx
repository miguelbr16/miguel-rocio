import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { ExpedienteCaso002 } from "@/components/expediente/ExpedienteCaso002";

export const metadata = {
  title: "Caso 002 · El primer año | Miguel & Rocío",
  description: "Investigación del aniversario — pistas diarias hasta la gran noche.",
};

export default function Caso002Page() {
  return (
    <SiteConfigProvider>
      <ExpedienteCaso002 />
    </SiteConfigProvider>
  );
}
