import { useAuth } from "@/context/AuthContext";

export function ProfileHero() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <section className="mb-4 md:mb-10">
      <div className="bg-card rounded-[20px] md:rounded-[32px] p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center relative overflow-hidden border border-border shadow-sm">
        <span className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" aria-hidden="true" />
        <hgroup className="flex-1 z-10">
          <h1 className="font-bold text-xl md:text-3xl tracking-tight mb-0.5 text-foreground">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs md:text-base text-muted-foreground mb-3">
            {user.companyName || "Personal Account"}
          </p>
          <ul className="flex flex-wrap gap-1.5 list-none p-0">
            <li>
              <span className="bg-success/10 text-success text-xs font-medium px-2.5 py-1 rounded-full">
                Active
              </span>
            </li>
            {user.isEmailVerified && (
              <li>
                <span className="bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                  Email verified
                </span>
              </li>
            )}
          </ul>
        </hgroup>
        <aside className="w-full md:w-auto z-10">
          <dl className="bg-muted/50 p-3 md:p-4 rounded-xl border border-border">
            <dt className="text-xs text-muted-foreground block mb-1.5">
              Account ID
            </dt>
            <dd>
              <code className="font-mono text-sm font-semibold text-foreground">
                #{user.id}
              </code>
            </dd>
            <dd className="mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">Connected</span>
            </dd>
          </dl>
        </aside>
      </div>
    </section>
  );
}
