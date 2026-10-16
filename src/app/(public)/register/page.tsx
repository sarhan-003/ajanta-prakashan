"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BellRing, CheckCircle2, FileText, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/Button";
import { buttonClasses } from "@/components/common/buttonStyles";
import { Checkbox, FormField, Input, Select } from "@/components/common/FormControls";
import { Skeleton } from "@/components/common/LoadingSpinner";
import { PageHero } from "@/components/public/PageHero";
import { DESIGNATION_OPTIONS, registrationSchema, type RegistrationFormValues } from "@/schemas/registration";
import { registerUser } from "@/services/userService";
import { getConferenceById } from "@/services/conferenceService";
import { friendlyFirebaseError } from "@/components/common/ErrorState";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { buildWhatsAppLink, registrationWhatsAppMessage } from "@/utils/whatsapp";

const PERKS = [
  { icon: FileText, title: "Full conference details", text: "Tracks, fees, important dates, committees and payment information." },
  { icon: MessageCircle, title: "One-tap WhatsApp registration", text: "Confirm your interest directly with the organisers — no long forms." },
  { icon: BellRing, title: "Deadline updates", text: "Be the first to know about new conferences, deadlines and acceptances." },
];

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conferenceId = searchParams.get("conferenceId");
  const next = searchParams.get("next");

  const { loading: authLoading, profile, refreshProfile } = usePublicAuth();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [whatsAppHref, setWhatsAppHref] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { notificationEnabled: true },
  });

  // Already registered on this device — nothing to do here, send them onward.
  useEffect(() => {
    if (!authLoading && profile && !submitted) {
      router.replace(next || (conferenceId ? `/conferences/view?id=${conferenceId}` : "/profile"));
    }
  }, [authLoading, profile, submitted, next, conferenceId, router]);

  async function onSubmit(values: RegistrationFormValues) {
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

      if (conferenceId) {
        const conference = await getConferenceById(conferenceId).catch(() => null);
        if (conference?.whatsappNumber) {
          setWhatsAppHref(buildWhatsAppLink(conference.whatsappNumber, registrationWhatsAppMessage(conference.title, values.fullName)));
        }
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(friendlyFirebaseError(err));
    }
  }

  if (authLoading || (profile && !submitted)) {
    return (
      <div className="container-page py-12">
        <Skeleton className="h-96 w-full max-w-2xl rounded-2xl" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md animate-scale-in rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-card sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-serif text-2xl font-bold text-emerald-950">Registration successful!</h1>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">You will receive updates about upcoming conferences and events.</p>
          <div className="mt-8 flex flex-col gap-3">
            {whatsAppHref && (
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ size: "lg", className: "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-600" })}
              >
                <MessageCircle className="h-5 w-5" /> Message us on WhatsApp
              </a>
            )}
            <Link
              href={next || (conferenceId ? `/conferences/view?id=${conferenceId}` : "/conferences")}
              className={buttonClasses({ variant: whatsAppHref ? "outline" : "primary", size: "lg" })}
            >
              {conferenceId ? "View Conference" : "Browse Conferences"} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/profile" className="text-sm font-medium text-emerald-700 underline-offset-4 hover:text-emerald-900 hover:underline">
              View my profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Create your visitor profile"
        title="Register"
        description="Register your details to view conferences and receive updates about upcoming events. No OTP verification required."
      />

      <div className="container-page grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_380px] lg:gap-14">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-ink-200/70 bg-white p-6 shadow-card sm:p-8" noValidate>
          {serverError && (
            <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-inset ring-amber-200" role="alert">
              {serverError}
            </p>
          )}

          <div role="group" aria-labelledby="personal-details" className="space-y-5">
            <h2 id="personal-details" className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              Personal details
            </h2>
            <FormField label="Full Name" htmlFor="fullName" required error={errors.fullName?.message}>
              <Input id="fullName" autoComplete="name" invalid={!!errors.fullName} {...register("fullName")} />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Mobile Number" htmlFor="mobile" required error={errors.mobile?.message}>
                <Input id="mobile" inputMode="numeric" autoComplete="tel-national" maxLength={10} invalid={!!errors.mobile} {...register("mobile")} />
              </FormField>
              <FormField label="Email (optional)" htmlFor="email" error={errors.email?.message}>
                <Input id="email" type="email" autoComplete="email" invalid={!!errors.email} {...register("email")} />
              </FormField>
            </div>
          </div>

          <div role="group" aria-labelledby="location-work" className="mt-8 space-y-5 border-t border-ink-100 pt-8">
            <h2 id="location-work" className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              Location &amp; work
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="City" htmlFor="city" required error={errors.city?.message}>
                <Input id="city" autoComplete="address-level2" invalid={!!errors.city} {...register("city")} />
              </FormField>
              <FormField label="State (optional)" htmlFor="state" error={errors.state?.message}>
                <Input id="state" autoComplete="address-level1" invalid={!!errors.state} {...register("state")} />
              </FormField>
            </div>
            <FormField label="Designation" htmlFor="designation" required error={errors.designation?.message}>
              <Select id="designation" invalid={!!errors.designation} defaultValue="" {...register("designation")}>
                <option value="" disabled>
                  Select designation
                </option>
                {DESIGNATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="School / College / Institution" htmlFor="institution" required error={errors.institution?.message}>
              <Input id="institution" autoComplete="organization" invalid={!!errors.institution} {...register("institution")} />
            </FormField>
          </div>

          <div className="mt-8 border-t border-ink-100 pt-6">
            <Checkbox label="Notify me about upcoming conferences and events" {...register("notificationEnabled")} defaultChecked />
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full" loading={isSubmitting}>
            Register <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Your details are handled as described in our{" "}
            <Link href="/privacy-policy" className="font-medium text-brand-700 underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        <aside>
          <div className="relative overflow-hidden rounded-3xl bg-ink-950 p-7 text-white shadow-lift sm:p-8 lg:sticky lg:top-24">
            <div
              className="absolute inset-0"
              style={{ backgroundImage: "radial-gradient(70% 60% at 100% 0%, rgba(181,101,29,0.5), transparent 60%)" }}
              aria-hidden
            />
            <div className="bg-dots absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden />
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                <Sparkles className="h-3.5 w-3.5" /> Why register?
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug">One quick form unlocks everything.</h2>
              <ul className="mt-7 space-y-6">
                {PERKS.map((perk) => (
                  <li key={perk.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-300 ring-1 ring-white/10">
                      <perk.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">{perk.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-300">{perk.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container-page py-12"><Skeleton className="h-96 w-full max-w-2xl rounded-2xl" /></div>}>
      <RegisterPageInner />
    </Suspense>
  );
}
