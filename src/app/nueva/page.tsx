import { redirect } from "next/navigation";

/** La vista previa ya es la web principal. */
export default function NuevaPage() {
  redirect("/");
}
