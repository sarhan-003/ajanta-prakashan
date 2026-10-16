"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, BellOff, Building2, CheckCircle2, Mail, MapPin, Pencil, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/Button";
import { Checkbox, FormField, Input, Select } from "@/components/common/FormControls";
import { Skeleton } from "@/components/common/LoadingSpinner";
import { friendlyFirebaseError } from "@/components/common/ErrorState";
import { LinkButton } from "@/components/common/LinkButton";
import { PageHero } from "@/components/public/PageHero";
import { DESIGNATION_OPTIONS, registrationSchema, type RegistrationFormValues } from "@/schemas/registration";
import { registerUser } from "@/services/userService";
import { usePublicAuth } from "@/contexts/PublicAuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { loading: authLoading, profile, refreshProfile } = usePublicAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormValues>({ resolver: zodResolver(registrationSchema) });

  useEffect(() => {
    if (!authLoading && !profile) router.replace("/register?next=/profile");
  }, [authLoading, profile, router]);

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName,
        mobile: profile.mobile,
        email: profile.email || "",
        city: profile.city,
        designation: profile.designation as RegistrationFormValues["designation"],
        institution: profile.institution,
        state: profile.state || "",
        notificationEnabled: profile.notificationEnabled,
      });
    }
  }, [profile, reset]);

  async function onSubmit(values: RegistrationFormValues) {
    setSaving(true);
    setServerError(null);
    try {
      await registerUser({
        fullName: values.fullName,
        mobile: values.mobile,
        email: values.email || null,
        city: values.city,
        designation: values.designation,
        institution: values.institution,
        state: values.state || null,
        notificationEnabled: values.notificationEnabled,
      });
      await refreshProfile();
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setServerError(friendlyFirebaseError(err));
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !profile) {
    return (
      <div className="container-page py-12">
        <Skeleton className="h-96 w-full max-w-3xl rounded-2xl" />
      </div>
    );
  }

  const location = [profile.city, profile.state].filter(Boolean).join(", ");

  return (
    <>
      <PageHero eyebrow="Your account" title="My Profile" description="Your registration details for Ajanta Prakashan conferences." />

      <div className="container-page max-w-3xl py-10 sm:py-14">
        {saved && (
          <p className="mb-6 flex animate-fade-in items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200" role="status">
            <CheckCircle2 className="h-4 w-4" /> Profile updated successfully.
          </p>
        )}

        {!editing ? (
          <div className="overflow-hidden rounded-3xl border border-ink-200/70 bg-white shadow-card">
            <div className="flex flex-col gap-5 border-b border-ink-100 bg-gradient-to-r from-brand-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-500 font-serif text-2xl font-bold uppercase text-white shadow-lift">
                  {profile.fullName.trim().charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-serif text-2xl font-bold text-ink-900">{profile.fullName}</h2>
                  <p className="mt-0.5 text-sm text-ink-600">{profile.designation}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setEditing(true)} className="shrink-0 self-start sm:self-auto">
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            </div>

            <dl className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
              <Field icon={Phone} label="Mobile Number" value={profile.mobile} />
              <Field icon={Mail} label="Email" value={profile.email || "—"} />
              <Field icon={MapPin} label="City / State" value={location || "—"} />
              <Field icon={Building2} label="Institution" value={profile.institution} />
              <Field
                icon={profile.notificationEnabled ? Bell : BellOff}
                label="Notifications"
                value={profile.notificationEnabled ? "Enabled" : "Disabled"}
              />
            </dl>

            <div className="border-t border-ink-100 bg-paper-50 px-6 py-5 sm:px-8">
              <LinkButton href="/conferences" variant="primary">
                Browse conferences
              </LinkButton>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-3xl border border-ink-200/70 bg-white p-6 shadow-card sm:p-8" noValidate>
            <h2 className="font-serif text-xl font-semibold text-ink-900">Edit your details</h2>
            {serverError && (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-inset ring-amber-200" role="alert">
                {serverError}
              </p>
            )}

            <FormField label="Full Name" htmlFor="fullName" required error={errors.fullName?.message}>
              <Input id="fullName" invalid={!!errors.fullName} {...register("fullName")} />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Mobile Number" htmlFor="mobile" required error={errors.mobile?.message}>
                <Input id="mobile" inputMode="numeric" maxLength={10} invalid={!!errors.mobile} {...register("mobile")} />
              </FormField>
              <FormField label="Email (optional)" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="City" htmlFor="city" required error={errors.city?.message}>
                <Input id="city" invalid={!!errors.city} {...register("city")} />
              </FormField>
              <FormField label="State (optional)" htmlFor="state" error={errors.state?.message}>
                <Input id="state" invalid={!!errors.state} {...register("state")} />
              </FormField>
            </div>

            <FormField label="Designation" htmlFor="designation" required error={errors.designation?.message}>
              <Select id="designation" invalid={!!errors.designation} {...register("designation")}>
                {DESIGNATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="School / College / Institution" htmlFor="institution" required error={errors.institution?.message}>
              <Input id="institution" invalid={!!errors.institution} {...register("institution")} />
            </FormField>

            <Checkbox label="Notify me about upcoming conferences and events" {...register("notificationEnabled")} />

            <div className="flex flex-col-reverse gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

function Field({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</dt>
        <dd className="mt-0.5 break-words font-medium text-ink-900">{value}</dd>
      </div>
    </div>
  );
}
