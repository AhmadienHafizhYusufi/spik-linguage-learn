import { requirePaidUser } from "@/lib/auth/session";
import { AppHeader } from "@/components/app/app-header";

export default async function LearnLayout({ children }: LayoutProps<"/platform/learn">) {
  const user = await requirePaidUser();

  return (
    <div className="min-h-full bg-surface">
      <AppHeader email={user.email} />
      {children}
    </div>
  );
}
