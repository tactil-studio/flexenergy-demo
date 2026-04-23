import { Check, Loader2, Pencil, X } from "lucide-react";
import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { getClient } from "@/lib/smartsphere";
import { CustomerApiError } from "@/lib/smartsphere/modules/customers";

function resolveCustomerError(err: unknown): string {
  if (err instanceof CustomerApiError) {
    if (err.errorCode === "DUPLICATE_EMAIL") return "This email is already in use.";
    return err.message || "Failed to save. Please try again.";
  }
  return "Failed to save. Please try again.";
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ firstName, lastName }: { firstName?: string; lastName?: string }) {
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?";
  return (
    <div className="size-14 md:size-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-xl md:text-2xl font-bold text-primary select-none">{initials}</span>
    </div>
  );
}

// ─── Info cell (read mode) ────────────────────────────────────────────────────

function InfoCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="py-3 px-4 md:px-5">
      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-foreground truncate ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

// ─── Field wrapper (edit mode) ────────────────────────────────────────────────

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[10px] text-muted-foreground font-semibold block mb-1 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}

// ─── ProfileHero ──────────────────────────────────────────────────────────────

export function ProfileHero() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: "",
    companyName: user?.companyName ?? "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: user.firstName ?? prev.firstName,
        lastName: user.lastName ?? prev.lastName,
        email: user.email ?? prev.email,
        companyName: user.companyName ?? prev.companyName,
      }));
    }
  }, [user]);

  const handleChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const handleCancel = () => {
    if (user) {
      setForm({ firstName: user.firstName ?? "", lastName: user.lastName ?? "", email: user.email ?? "", phone: "", companyName: user.companyName ?? "" });
    }
    setError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    try {
      await getClient().customers.createCustomer({
        firstName: form.firstName || null,
        lastName: form.lastName || null,
        email: form.email || null,
        phone: form.phone || null,
        companyName: form.companyName || null,
      });
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(resolveCustomerError(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";

  return (
    <section className="mb-4 md:mb-10">
      <div className="bg-card rounded-[20px] md:rounded-4xl border border-border shadow-sm overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 md:gap-5 p-5 md:p-7">
          <Avatar firstName={user.firstName} lastName={user.lastName} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-bold text-base md:text-xl tracking-tight text-foreground truncate leading-tight">
                  {fullName}
                </h1>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {user.email || "—"}
                </p>
              </div>
              <Button
                variant={isEditing ? "ghost" : "outline"}
                size="sm"
                className="shrink-0 gap-1.5 text-xs"
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
              >
                {isEditing
                  ? <><X className="size-3.5" /> Cancel</>
                  : saved
                    ? <><Check className="size-3.5 text-success" /> Saved</>
                    : <><Pencil className="size-3.5" /> Edit</>
                }
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="bg-success/10 text-success text-[10px] font-semibold px-2 py-0.5 rounded-full">Active</span>
              {user.isEmailVerified && (
                <span className="bg-muted text-muted-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">Email verified</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Read mode info strip ── */}
        {!isEditing && (
          <div className="grid grid-cols-2 md:grid-cols-3 border-t border-border divide-x divide-border">
            <InfoCell label="Company" value={user.companyName || "—"} />
            <InfoCell label="Account ID" value={`#${user.id}`} mono />
            <div className="hidden md:flex items-center justify-start py-3 px-5 gap-1.5">
              <span className="size-1.5 rounded-full bg-success inline-block shrink-0" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">Connected</span>
            </div>
          </div>
        )}

        {/* ── Edit form ── */}
        {isEditing && (
          <div className="border-t border-border p-5 md:p-7">
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <Field id="edit-first-name" label="First name">
                <Input id="edit-first-name" value={form.firstName} onChange={handleChange("firstName")} placeholder="First name" />
              </Field>
              <Field id="edit-last-name" label="Last name">
                <Input id="edit-last-name" value={form.lastName} onChange={handleChange("lastName")} placeholder="Last name" />
              </Field>
              <Field id="edit-email" label="Email">
                <Input id="edit-email" type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" />
              </Field>
              <Field id="edit-phone" label="Phone">
                <Input id="edit-phone" type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+41 ..." />
              </Field>
              <Field id="edit-company" label="Company">
                <Input id="edit-company" value={form.companyName} onChange={handleChange("companyName")} placeholder="Company name" />
              </Field>
            </div>
            {error && <p className="text-xs text-destructive mb-3">{error}</p>}
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving
                ? <Loader2 className="size-3.5 animate-spin" />
                : <Check className="size-3.5" />
              }
              Save changes
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
