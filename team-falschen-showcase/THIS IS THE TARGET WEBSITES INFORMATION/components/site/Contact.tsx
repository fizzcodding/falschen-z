import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

type Errors = { name?: string; email?: string; message?: string };

export function Contact() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const next: Errors = {};
    if (name.length < 2) next.name = "Enter your name (2 characters minimum).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (message.length < 10)
      next.message = "Tell us a little more (10 characters minimum).";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `Fälschen enquiry from ${name}`,
    )}&body=${body}`;
    window.setTimeout(() => {
      void navigate({ to: "/thank-you" });
    }, 400);
  };

  const field =
    "w-full border-[3px] border-ink bg-paper px-4 py-3 font-sans text-base text-ink outline-none focus:border-phosphor";

  return (
    <section id="contact" className="relative border-b-[3px] border-ink">
      <div className="grid-schematic pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <p className="label-mono text-muted-foreground">SEC 04 / CONTACT</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            TALK TO THE TEAM
          </h2>
          <dl className="mt-8 border-[3px] border-ink">
            <div className="border-b-[3px] border-ink px-5 py-4">
              <dt className="label-mono text-muted-foreground">EMAIL</dt>
              <dd className="mt-1">
                <a
                  className="font-display text-lg underline decoration-phosphor decoration-[3px] underline-offset-4"
                  href={`mailto:${SITE.email}`}
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div className="border-b-[3px] border-ink px-5 py-4">
              <dt className="label-mono text-muted-foreground">PHONE</dt>
              <dd className="mt-1">
                <a
                  className="font-display text-lg underline decoration-phosphor decoration-[3px] underline-offset-4"
                  href={`tel:${SITE.phone}`}
                >
                  {SITE.phoneLabel}
                </a>
              </dd>
            </div>
            <div className="px-5 py-4">
              <dt className="label-mono text-muted-foreground">BASE</dt>
              <dd className="mt-1 font-display text-lg">{SITE.location}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={onSubmit} noValidate className="panel-flat p-6">
          <div className="space-y-5">
            <div>
              <label className="label-mono block pb-2" htmlFor="name">
                Name
              </label>
              <input id="name" name="name" className={field} autoComplete="name" />
              {errors.name && (
                <p className="label-mono mt-2 text-destructive">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="label-mono block pb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={field}
                autoComplete="email"
              />
              {errors.email && (
                <p className="label-mono mt-2 text-destructive">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="label-mono block pb-2" htmlFor="message">
                Message
              </label>
              <textarea id="message" name="message" rows={5} className={field} />
              {errors.message && (
                <p className="label-mono mt-2 text-destructive">
                  {errors.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="label-mono w-full border-[3px] border-ink bg-ink px-6 py-4 text-paper shadow-[4px_4px_0_var(--ink)] transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-70"
            >
              {status === "sending" ? (
                <>
                  TRANSMITTING <span className="caret-blink">_</span>
                </>
              ) : (
                "Send message"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
