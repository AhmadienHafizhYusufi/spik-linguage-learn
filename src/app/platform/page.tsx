import { redirect } from "next/navigation";

// app.learnhub.id/ → dashboard (cadangan; proxy.ts biasanya sudah mengalihkan)
export default function PlatformHome() {
  redirect("/dashboard");
}
