import Link from "next/link";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./buttonStyles";

/** A link that looks like a <Button>. Internal hrefs use next/link; pass `external` to open in a new tab. */
export function LinkButton({
  href,
  variant,
  size,
  external,
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = buttonClasses({ variant, size, className });
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
