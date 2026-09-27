import { requirePaidUser } from "@/lib/auth/session";
import { AppHeader } from "@/components/app/app-header";

export default async function DashboardLayout({ children }: LayoutProps<"/platform/dashboard">) {
  const user = await requirePaidUser();

  return (
    <div className="min-h-full bg-surface">
      <AppHeader email={user.email} />
      {children}
    </div>
  );
}
