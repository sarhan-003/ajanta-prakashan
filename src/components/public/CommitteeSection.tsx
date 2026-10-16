import { COMMITTEE_CATEGORIES, type CommitteeMember } from "@/types";

function initials(name: string) {
  const parts = name
    .replace(/^(dr|prof|mr|mrs|ms|shri|smt|adv)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function CommitteeSection({ members }: { members: CommitteeMember[] }) {
  if (!members?.length) return null;
  const byCategory = COMMITTEE_CATEGORIES.map((category) => ({
    category,
    people: members.filter((m) => m.category === category).sort((a, b) => a.displayOrder - b.displayOrder),
  })).filter((g) => g.people.length > 0);

  return (
    <div className="space-y-9">
      {byCategory.map((group) => (
        <div key={group.category}>
          <h4 className="flex items-center gap-3 font-serif text-lg font-semibold text-ink-900">
            {group.category}
            <span className="h-px flex-1 bg-gradient-to-r from-ink-200 to-transparent" aria-hidden />
          </h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {group.people.map((person) => (
              <div key={person.id} className="flex items-center gap-3.5 rounded-xl border border-ink-200/80 bg-white p-3.5 transition-colors hover:border-brand-200">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                  {initials(person.name) || "•"}
                </div>
                <div className="min-w-0">
                  <p className="font-medium leading-snug text-ink-900">{person.name}</p>
                  {(person.designation || person.institution) && (
                    <p className="mt-0.5 text-sm leading-snug text-ink-500">
                      {person.designation}
                      {person.designation && person.institution && ", "}
                      {person.institution}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
