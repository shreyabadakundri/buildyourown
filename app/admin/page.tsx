import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  const authed = cookies().get("bwm_admin")?.value === "1";
  if (authed) {
    redirect("/admin/dashboard");
  }
  redirect("/admin/login");
}