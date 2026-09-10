import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { DashboardShell } from "../dashboard/shell";

export const Route = createFileRoute("/forms")({ component: Settings });

const STEPS = ["Workspace", "Invite team", "Connect repo"] as const;

const SHORTCUTS = [
  { action: "Save changes", keys: "⌘S" },
  { action: "Search", keys: "⌘K" },
  { action: "Next step", keys: "⌘→" },
  { action: "Previous step", keys: "⌘←" },
  { action: "Toggle sidebar", keys: "⌘B" },
  { action: "Discard changes", keys: "Esc" },
] as const;

const INITIAL = {
  workspace: "luz-dashboard",
  provider: "",
  name: "Carlos",
  email: "carlos@d00m.gui",
  handle: "carlos",
  bio: "",
  digest: true,
  mentions: true,
  sound: false,
  volume: 60,
  frequency: "instant",
  mode: "system",
  density: 100,
  reduceMotion: false,
};

type Form = typeof INITIAL;

const EMAIL_RE = /.+@.+\..+/;

function ShortcutsAside() {
  const [query, setQuery] = useState("");
  const matches = SHORTCUTS.filter((s) =>
    s.action.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="card background-raised">
      <div className="card-meta">
        <strong>Shortcuts</strong>
        <span className="space" />
        <span className="badge ghost pill">{SHORTCUTS.length}</span>
      </div>
      <div className="card-content">
        <input
          type="search"
          placeholder="Filter shortcuts…"
          aria-label="Filter shortcuts"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <ul className="list">
        {matches.map((s) => (
          <li key={s.action} className="list-row">
            <span className="list-col-grow">{s.action}</span>
            <kbd>{s.keys}</kbd>
          </li>
        ))}
        {matches.length === 0 ? (
          <li className="list-row text-muted-foreground">
            No shortcut matches "{query}"
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function Settings() {
  const [form, setForm] = useState<Form>(INITIAL);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [handleVerified, setHandleVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const emailValid =
    form.email.length === 0 ? undefined : EMAIL_RE.test(form.email);
  const onboarded = step >= STEPS.length;
  const seatsUsed = 3;
  const seats = 5;
  const storageUsed = 6.4;
  const storage = 10;

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 900);
  }

  function onReset() {
    setForm(INITIAL);
    setSaved(false);
    setHandleVerified(false);
    setVerificationSent(false);
  }

  function sendTest() {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 1500);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "s" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const saveButton = (
    <button
      type="submit"
      form="settings-form"
      data-role="apply"
      className={saving ? "loading" : undefined}
      aria-busy={saving || undefined}
    >
      {saving ? "Saving…" : "Save changes"}
    </button>
  );

  return (
    <DashboardShell
      title="Settings"
      description={
        <>
          Workspace <code>{form.workspace}</code> · profile, notifications,
          appearance and plan.
        </>
      }
      actions={
        <>
          <button type="button" className="outline">
            Export
          </button>
          {saveButton}
        </>
      }
      aside={<ShortcutsAside />}
    >
      {saved ? (
        <div className="alert success" role="status">
          <span className="icon" aria-hidden="true">
            ✓
          </span>
          Changes saved.
        </div>
      ) : null}

      <form
        id="settings-form"
        ref={formRef}
        className="stack"
        onSubmit={onSubmit}
        onReset={onReset}
      >
        <div className="card background-raised">
          <div className="card-meta">
            <strong>Onboarding</strong>
            <span className="space" />
            {onboarded ? (
              <span className="badge">Complete</span>
            ) : (
              <span className="badge ghost pill">
                Step {step + 1} of {STEPS.length}
              </span>
            )}
          </div>
          <div className="card-content">
            <div className="wizard">
              {STEPS.map((label, index) => (
                <span
                  key={label}
                  className="wizard-step"
                  data-state={
                    index < step
                      ? "done"
                      : index === step
                        ? "active"
                        : undefined
                  }
                >
                  {label}
                </span>
              ))}
            </div>
            <hr />
            {step === 0 ? (
              <fieldset>
                <label className="field">
                  <span>Workspace name</span>
                  <input
                    type="text"
                    value={form.workspace}
                    onChange={(event) => set("workspace", event.target.value)}
                  />
                </label>
                <div className="field">
                  <label htmlFor="workspace-id">Workspace ID</label>
                  <span className="join">
                    <input
                      id="workspace-id"
                      type="text"
                      value="ws_8f3a19c2"
                      disabled
                    />
                    <button
                      type="button"
                      className="ghost square"
                      aria-label="Copy workspace ID"
                      onClick={() =>
                        navigator.clipboard?.writeText("ws_8f3a19c2")
                      }
                    >
                      ⧉
                    </button>
                  </span>
                  <small className="field-hint">
                    Used in API calls and CLI commands. Cannot be changed.
                  </small>
                </div>
              </fieldset>
            ) : null}
            {step === 1 ? (
              <fieldset>
                <label className="field">
                  <span>Invite by email</span>
                  <input type="email" placeholder="teammate@company.com" />
                  <small className="field-hint">
                    {seats - seatsUsed} seats left on this plan.
                  </small>
                </label>
                <div>
                  <button type="button" data-role="contrast">
                    Copy invite link
                  </button>
                </div>
              </fieldset>
            ) : null}
            {step === 2 ? (
              <fieldset>
                <label className="field">
                  <span>Git provider</span>
                  <select
                    value={form.provider}
                    onChange={(event) => set("provider", event.target.value)}
                  >
                    <option value="">Choose a provider</option>
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                    <option value="bitbucket">Bitbucket</option>
                  </select>
                </label>
                <div className="alert info">
                  <span className="icon" aria-hidden="true">
                    i
                  </span>
                  You can connect a repository later from Projects.
                </div>
              </fieldset>
            ) : null}
            {onboarded ? (
              <div className="alert success" role="status">
                <span className="icon" aria-hidden="true">
                  ✓
                </span>
                Workspace <code>{form.workspace}</code> is ready.
              </div>
            ) : null}
          </div>
          <div className="card-footer">
            <span className="space" />
            <span className="join">
              <button
                type="button"
                className="ghost"
                disabled={step === 0}
                onClick={() => setStep(Math.max(0, step - 1))}
              >
                Back
              </button>
              <button
                type="button"
                disabled={onboarded}
                onClick={() => setStep(step + 1)}
              >
                {step === STEPS.length - 1 ? "Finish" : "Next"}
              </button>
            </span>
          </div>
        </div>

        <div className="grid md">
          <div className="card background-raised">
            <div className="card-meta">
              <strong>Profile</strong>
              <span className="space" />
              <span className="avatar sm">
                {form.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?"}
              </span>
            </div>
            <div className="card-content">
              <fieldset>
                <label className="field">
                  <span>Full name</span>
                  <input
                    type="text"
                    placeholder="Ada Lovelace"
                    value={form.name}
                    onChange={(event) => set("name", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    aria-invalid={
                      emailValid === undefined ? undefined : !emailValid
                    }
                    value={form.email}
                    onChange={(event) => set("email", event.target.value)}
                  />
                  <small className="field-hint">
                    {emailValid === false
                      ? "Enter a valid email address."
                      : "Used for sign-in and billing receipts."}
                  </small>
                </label>
                {verificationSent ? (
                  <div className="alert info" role="status">
                    <span className="icon" aria-hidden="true">
                      i
                    </span>
                    Verification email sent to <code>{form.email}</code>.
                  </div>
                ) : (
                  <div className="alert warning">
                    <span className="icon" aria-hidden="true">
                      !
                    </span>
                    <span className="grow">
                      This email is not verified yet.
                    </span>
                    <button
                      type="button"
                      data-role="secondary"
                      disabled={emailValid !== true}
                      onClick={() => setVerificationSent(true)}
                    >
                      Resend
                    </button>
                  </div>
                )}
              </fieldset>
              <hr className="dashed" />
              <fieldset>
                <div className="field">
                  <label htmlFor="handle" className="flex items-center gap-2">
                    Handle
                    {handleVerified ? (
                      <span className="badge">Verified</span>
                    ) : null}
                  </label>
                  <div className="join">
                    <span className="text-muted-foreground">@</span>
                    <input
                      id="handle"
                      type="text"
                      className="grow"
                      value={form.handle}
                      onChange={(event) => {
                        set("handle", event.target.value);
                        setHandleVerified(false);
                      }}
                    />
                    <button
                      type="button"
                      disabled={handleVerified}
                      onClick={() => setHandleVerified(true)}
                    >
                      Verify
                    </button>
                  </div>
                </div>
                <label className="field">
                  <span>Bio</span>
                  <textarea
                    rows={3}
                    placeholder="A short line for your public profile"
                    value={form.bio}
                    onChange={(event) => set("bio", event.target.value)}
                  />
                </label>
              </fieldset>
              <hr className="dashed" />
              <label htmlFor="file" className="field">
                <span>Avatar</span>
                <input id="file" type="file" accept="image/*" />
                <small className="field-hint">PNG or JPG, up to 2 MB.</small>
              </label>
            </div>
          </div>

          <div className="card background-raised">
            <div className="card-meta">
              <strong>Notifications</strong>
              <span className="space" />
              <button
                type="button"
                data-role="tertiary"
                onClick={sendTest}
                disabled={testSent}
              >
                {testSent ? "Sent" : "Send test"}
              </button>
            </div>
            <div className="list">
              <label className="list-row">
                <input
                  type="checkbox"
                  checked={form.digest}
                  onChange={(event) => set("digest", event.target.checked)}
                />
                <span className="list-col-grow">Weekly digest</span>
                <span className="badge ghost">email</span>
              </label>
              <label className="list-row">
                <input
                  type="checkbox"
                  checked={form.mentions}
                  onChange={(event) => set("mentions", event.target.checked)}
                />
                <span className="list-col-grow">Mentions and replies</span>
                <span className="badge ghost">push</span>
              </label>
              <label className="list-row">
                <input type="checkbox" defaultChecked disabled />
                <span className="list-col-grow">Billing alerts</span>
                <span className="badge ghost">required</span>
              </label>
            </div>
            <div className="card-content">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <label className="field row">
                    <input
                      type="checkbox"
                      role="switch"
                      checked={form.sound}
                      onChange={(event) => set("sound", event.target.checked)}
                    />
                    <span>Sound</span>
                  </label>
                  <input
                    type="range"
                    className="app-volume"
                    aria-label="Sound volume"
                    min={0}
                    max={100}
                    step={20}
                    data-ticks=""
                    display-vertical=""
                    disabled={!form.sound}
                    value={form.volume}
                    onChange={(event) =>
                      set("volume", Number(event.target.value))
                    }
                  />
                  <code className="text-sm">{form.volume}%</code>
                </div>
                <fieldset className="grow">
                  <span className="field-hint">Delivery</span>
                  {(["instant", "hourly", "daily"] as const).map((value) => (
                    <label key={value} className="field row">
                      <input
                        type="radio"
                        name="frequency"
                        value={value}
                        checked={form.frequency === value}
                        onChange={() => set("frequency", value)}
                      />
                      <span>{value[0]!.toUpperCase() + value.slice(1)}</span>
                    </label>
                  ))}
                </fieldset>
              </div>
            </div>
          </div>

          <div className="card background-raised">
            <div className="card-meta">
              <strong>Appearance</strong>
              <span className="space" />
              <code>{form.density}%</code>
            </div>
            <div className="card-content">
              <fieldset>
                <label className="field">
                  <span>Theme</span>
                  <select
                    value={form.mode}
                    onChange={(event) => set("mode", event.target.value)}
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
                <label className="field">
                  <span className="flex justify-between">
                    <span>Density</span>
                    <span className="field-hint">
                      {form.density < 100
                        ? "compact"
                        : form.density > 100
                          ? "comfortable"
                          : "default"}
                    </span>
                  </span>
                  <input
                    type="range"
                    className="app-density"
                    min={80}
                    max={120}
                    step={10}
                    data-ticks=""
                    value={form.density}
                    onChange={(event) =>
                      set("density", Number(event.target.value))
                    }
                  />
                </label>
              </fieldset>
              <hr />
              <label className="field row">
                <input
                  type="checkbox"
                  role="switch"
                  checked={form.reduceMotion}
                  onChange={(event) =>
                    set("reduceMotion", event.target.checked)
                  }
                />
                <span>Reduce motion</span>
              </label>
            </div>
          </div>

          <div className="card background-raised">
            <div className="card-meta">
              <strong>Plan</strong>
              <span className="space" />
              <button
                type="button"
                className="badge"
                data-tooltip="Trial ends Oct 1"
                data-placement="left"
              >
                Pro trial
              </button>
            </div>
            <div className="card-content">
              <label className="meter">
                <span>Seats</span>
                <code>
                  {seatsUsed}/{seats}
                </code>
                <progress value={seatsUsed} max={seats} />
              </label>
              <label className="meter">
                <span>Storage</span>
                <code>
                  {storageUsed}/{storage} GB
                </code>
                <progress value={storageUsed} max={storage} />
              </label>
              <hr />
              <div className="card surface-primary">
                <div className="card-content">
                  <button type="button" className="cta primary">
                    <span className="text-sm">From $12 per seat</span>
                    <span className="text-lg">Upgrade to Team</span>
                  </button>
                  <button type="button" className="glass block">
                    Compare plans
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" data-role="contrast" className="pill">
                  Manage billing
                </button>
                <span className="field-hint">Next invoice on Oct 1.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card background-raised">
          <div className="card-meta">
            <strong>Danger zone</strong>
          </div>
          <div className="card-content">
            <div className="alert danger">
              <span className="icon" aria-hidden="true">
                ×
              </span>
              <span className="grow">
                Deleting <code>{form.workspace}</code> removes every project and
                run. This cannot be undone.
              </span>
              <button
                type="button"
                data-role="cancel"
                data-tooltip="Requires owner confirmation"
                data-placement="left"
              >
                Delete workspace
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions sticky">
          <Link to="/" className="btn ghost">
            Cancel
          </Link>
          <button type="reset" className="outline">
            Reset
          </button>
          {saveButton}
        </div>
      </form>
    </DashboardShell>
  );
}
