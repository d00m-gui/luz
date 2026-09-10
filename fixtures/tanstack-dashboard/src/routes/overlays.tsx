import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import { DashboardShell } from "../dashboard/shell";

export const Route = createFileRoute("/overlays")({ component: Team });

const TABS = ["Members", "Invites", "Roles"] as const;
type Tab = (typeof TABS)[number];

const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];
type RoleFilter = "all" | Role;

const ROLE_SCHEME: Record<Role, string> = {
  admin: "primary",
  editor: "secondary",
  viewer: "tertiary",
};

const ROLE_INFO: Record<
  Role,
  { summary: string; permissions: readonly string[] }
> = {
  admin: {
    summary: "Full access. Manages billing, members and workspace settings.",
    permissions: [
      "members:write",
      "billing:write",
      "settings:write",
      "projects:write",
    ],
  },
  editor: {
    summary: "Creates and edits projects and notes. Cannot manage members.",
    permissions: ["projects:write", "notes:write", "members:read"],
  },
  viewer: {
    summary: "Read-only access to projects and notes.",
    permissions: ["projects:read", "notes:read"],
  },
};

type Presence = "online" | "away" | "offline";

const PRESENCE_SCHEME: Record<Presence, string> = {
  online: "success pulse",
  away: "warning",
  offline: "neutral",
};

const PRESENCE_TOOLTIP: Record<Presence, string> = {
  online: "Active now",
  away: "Idle for a while",
  offline: "Not connected",
};

type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  presence: Presence;
  lastActive: string;
  joined: string;
  location: string;
};

const INITIAL_MEMBERS: readonly Member[] = [
  {
    id: "cs",
    name: "Carlos Suárez",
    email: "carlos@luz.dev",
    role: "admin",
    presence: "online",
    lastActive: "now",
    joined: "2024-03-02",
    location: "Buenos Aires",
  },
  {
    id: "lm",
    name: "Lucía Méndez",
    email: "lucia@luz.dev",
    role: "editor",
    presence: "away",
    lastActive: "12m",
    joined: "2024-05-18",
    location: "Madrid",
  },
  {
    id: "tr",
    name: "Tomás Rivas",
    email: "tomas@luz.dev",
    role: "viewer",
    presence: "online",
    lastActive: "2m",
    joined: "2024-09-09",
    location: "Montevideo",
  },
  {
    id: "ap",
    name: "Ana Prieto",
    email: "ana@luz.dev",
    role: "editor",
    presence: "online",
    lastActive: "now",
    joined: "2025-01-14",
    location: "Lisbon",
  },
  {
    id: "jk",
    name: "Julia Kessler",
    email: "julia@luz.dev",
    role: "admin",
    presence: "offline",
    lastActive: "3d",
    joined: "2024-03-02",
    location: "Berlin",
  },
  {
    id: "mo",
    name: "Mateo Ortiz",
    email: "mateo@luz.dev",
    role: "viewer",
    presence: "offline",
    lastActive: "1w",
    joined: "2025-04-22",
    location: "Bogotá",
  },
  {
    id: "sn",
    name: "Sofía Navarro",
    email: "sofia@luz.dev",
    role: "editor",
    presence: "away",
    lastActive: "48m",
    joined: "2025-06-30",
    location: "Mexico City",
  },
  {
    id: "dh",
    name: "Diego Herrera",
    email: "diego@luz.dev",
    role: "viewer",
    presence: "online",
    lastActive: "5m",
    joined: "2025-08-11",
    location: "Santiago",
  },
];

type Invite = {
  email: string;
  role: Role;
  invitedBy: string;
  sent: string;
  expired: boolean;
};

const INITIAL_INVITES: readonly Invite[] = [
  {
    email: "nora@acme.io",
    role: "editor",
    invitedBy: "Carlos",
    sent: "2h",
    expired: false,
  },
  {
    email: "pablo@acme.io",
    role: "viewer",
    invitedBy: "Lucía",
    sent: "1d",
    expired: false,
  },
  {
    email: "irene@studio.co",
    role: "editor",
    invitedBy: "Carlos",
    sent: "3d",
    expired: false,
  },
  {
    email: "leo@studio.co",
    role: "viewer",
    invitedBy: "Ana",
    sent: "6d",
    expired: false,
  },
  {
    email: "marta@freelance.dev",
    role: "viewer",
    invitedBy: "Julia",
    sent: "9d",
    expired: true,
  },
  {
    email: "hugo@freelance.dev",
    role: "editor",
    invitedBy: "Carlos",
    sent: "14d",
    expired: true,
  },
  {
    email: "vera@agency.com",
    role: "viewer",
    invitedBy: "Sofía",
    sent: "21d",
    expired: true,
  },
];

const PAGE_SIZE = 5;
const REFRESH_MS = 800;
const NOTICE_MS = 3200;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function nextRole(role: Role): Role {
  return ROLES[(ROLES.indexOf(role) + 1) % ROLES.length]!;
}

function RoleBadge({ role }: { role: Role }) {
  return <span className={`badge ${ROLE_SCHEME[role]}`}>{role}</span>;
}

function PresenceDot({
  presence,
  tooltip,
}: {
  presence: Presence;
  tooltip?: boolean;
}) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`status ${PRESENCE_SCHEME[presence]}`}
        data-tooltip={tooltip ? PRESENCE_TOOLTIP[presence] : undefined}
        data-placement={tooltip ? "right" : undefined}
        aria-hidden={tooltip ? undefined : "true"}
      />
      <span className="text-sm">{presence}</span>
    </span>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: PAGE_SIZE }, (_, i) => (
        <tr key={i} aria-hidden="true">
          <td>
            <span className="flex items-center gap-3">
              <span className="skeleton avatar sm" />
              <span className="skeleton text" />
            </span>
          </td>
          <td>
            <span className="skeleton badge" />
          </td>
          <td>
            <span className="skeleton badge" />
          </td>
          <td>
            <span className="skeleton badge" />
          </td>
          <td>
            <span className="skeleton avatar sm" />
          </td>
        </tr>
      ))}
    </>
  );
}

function Team() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Members");
  const [members, setMembers] = useState<readonly Member[]>(INITIAL_MEMBERS);
  const [invites, setInvites] = useState<readonly Invite[]>(INITIAL_INVITES);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<Member | null>(null);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const noticeEl = useRef<HTMLDivElement>(null);
  const noticeTimer = useRef<number | undefined>(undefined);
  const searchEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, dialog, [popover]")) return;
      if (event.key === "/") {
        event.preventDefault();
        searchEl.current?.focus();
      } else if (event.key === "i") {
        event.preventDefault();
        dialog.current?.showModal();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = query.trim().toLowerCase();
  const filtered = members.filter(
    (m) =>
      (roleFilter === "all" || m.role === roleFilter) &&
      (needle === "" ||
        m.name.toLowerCase().includes(needle) ||
        m.email.toLowerCase().includes(needle)),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const online = members.filter((m) => m.presence === "online").length;
  const pending = invites.filter((i) => !i.expired).length;

  function showNotice(text: string) {
    setNotice(text);
    const el = noticeEl.current;
    if (!el) return;
    window.clearTimeout(noticeTimer.current);
    el.hidePopover();
    el.showPopover();
    noticeTimer.current = window.setTimeout(() => el.hidePopover(), NOTICE_MS);
  }

  function filterRole(role: RoleFilter) {
    setRoleFilter(role);
    setPage(1);
  }

  function search(value: string) {
    setQuery(value);
    setPage(1);
  }

  function refresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), REFRESH_MS);
  }

  function changeRole(id: string) {
    setMembers((list) =>
      list.map((m) => (m.id === id ? { ...m, role: nextRole(m.role) } : m)),
    );
    setProfile((p) =>
      p && p.id === id ? { ...p, role: nextRole(p.role) } : p,
    );
  }

  function remove(member: Member) {
    setMembers((list) => list.filter((m) => m.id !== member.id));
    setProfile((p) => (p && p.id === member.id ? null : p));
    showNotice(`${member.name} was removed from the team`);
  }

  function invite(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const role = String(data.get("role") ?? "viewer") as Role;
    if (email === "") return;
    setInvites((list) => [
      { email, role, invitedBy: "Carlos", sent: "now", expired: false },
      ...list,
    ]);
    form.reset();
    showNotice(`Invite sent to ${email}`);
  }

  function resend(email: string) {
    setInvites((list) =>
      list.map((i) =>
        i.email === email ? { ...i, sent: "now", expired: false } : i,
      ),
    );
    showNotice(`Invite re-sent to ${email}`);
  }

  return (
    <DashboardShell
      title="Team"
      description={
        <>
          {members.length} members, {online} online, {pending} pending invites.
        </>
      }
      actions={
        <button
          className="btn"
          type="button"
          onClick={() => dialog.current?.showModal()}
        >
          Invite member
        </button>
      }
    >
      <section className="max-lg:hidden">
        <div className="tabs">
          {TABS.map((name) => (
            <Fragment key={name}>
              <input
                type="radio"
                name="team-tab"
                id={`team-tab-${name}`}
                className="tab-input"
                checked={tab === name}
                onChange={() => setTab(name)}
              />
              <label htmlFor={`team-tab-${name}`} className="tab">
                {name}
                {name === "Invites" && pending > 0 ? (
                  <span className="badge ghost pill">{pending}</span>
                ) : null}
              </label>
            </Fragment>
          ))}
        </div>
      </section>

      <section
        className="hidden open:block"
        data-open={tab === "Members" ? "" : undefined}
      >
        <div className="card background-raised">
          <div className="card-meta items-center">
            <strong>Members</strong>
            <span className="space" />
            <span className="badge ghost pill">
              {filtered.length} of {members.length}
            </span>
            <button
              className="btn ghost"
              type="button"
              onClick={refresh}
              aria-busy={refreshing}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
          <div className="card-toolbar">
            <div className="tabs segmented" aria-label="Filter by role">
              {(["all", ...ROLES] as const).map((role) => (
                <Fragment key={role}>
                  <input
                    type="radio"
                    name="role-filter"
                    id={`role-filter-${role}`}
                    className="tab-input"
                    checked={roleFilter === role}
                    onChange={() => filterRole(role)}
                  />
                  <label htmlFor={`role-filter-${role}`} className="tab">
                    {role}
                  </label>
                </Fragment>
              ))}
            </div>
            <span className="space" />
            <label className="join">
              <input
                ref={searchEl}
                type="search"
                placeholder="Search name or email"
                aria-label="Search members"
                value={query}
                onChange={(e) => search(e.target.value)}
              />
              <kbd>/</kbd>
            </label>
          </div>

          {!refreshing && rows.length === 0 ? (
            <div className="empty">
              <span className="empty-title">No members match</span>
              <span>
                Nothing for {roleFilter === "all" ? "any role" : roleFilter}
                {needle ? (
                  <>
                    {" "}
                    with <code>{query.trim()}</code>
                  </>
                ) : null}
                .
              </span>
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  filterRole("all");
                  search("");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>member</th>
                  <th>role</th>
                  <th>status</th>
                  <th>last active</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {refreshing ? (
                  <SkeletonRows />
                ) : (
                  rows.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <span className="flex items-center gap-3">
                          <span className="avatar sm">
                            {initials(member.name)}
                          </span>
                          <span className="flex flex-col min-w-0">
                            <span>{member.name}</span>
                            <span className="text-sm text-muted-foreground truncate">
                              {member.email}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td>
                        <RoleBadge role={member.role} />
                      </td>
                      <td>
                        <PresenceDot presence={member.presence} tooltip />
                      </td>
                      <td>
                        <code>{member.lastActive}</code>
                      </td>
                      <td>
                        <button
                          className="btn ghost icon"
                          type="button"
                          popoverTarget={`member-menu-${member.id}`}
                          aria-label={`Actions for ${member.name}`}
                        >
                          ⋯
                        </button>
                        <div
                          id={`member-menu-${member.id}`}
                          popover="auto"
                          className="menu"
                        >
                          <button
                            className="menu-item"
                            type="button"
                            popoverTarget="member-profile"
                            onClick={() => setProfile(member)}
                          >
                            View profile
                          </button>
                          <button
                            className="menu-item"
                            type="button"
                            popoverTarget={`member-menu-${member.id}`}
                            popoverTargetAction="hide"
                            onClick={() => changeRole(member.id)}
                          >
                            Change role
                            <span className="text-muted-foreground">
                              → {nextRole(member.role)}
                            </span>
                          </button>
                          <hr />
                          <button
                            className="menu-item danger"
                            type="button"
                            popoverTarget={`member-menu-${member.id}`}
                            popoverTargetAction="hide"
                            onClick={() => remove(member)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <div className="card-footer items-center">
            <span className="text-sm text-muted-foreground">
              {filtered.length === 0
                ? "0 members"
                : `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </span>
            <span className="space" />
            <nav className="tabs pagination" aria-label="Pagination">
              <button
                type="button"
                className="tab ghost"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
                aria-label="Previous page"
              >
                ‹
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className="tab ghost"
                  aria-current={current === n ? "page" : undefined}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className="tab ghost"
                disabled={current === pageCount}
                onClick={() => setPage(current + 1)}
                aria-label="Next page"
              >
                ›
              </button>
            </nav>
          </div>
        </div>
      </section>

      <section
        className="hidden open:block"
        data-open={tab === "Invites" ? "" : undefined}
      >
        <div className="card background-raised">
          <div className="card-meta items-center">
            <strong>Invites</strong>
            <span className="space" />
            <span className="badge ghost pill">{pending} pending</span>
            <button
              className="btn ghost"
              type="button"
              onClick={() => dialog.current?.showModal()}
            >
              New invite
            </button>
          </div>
          <ul className="list scroll-y scrollbar-thin lazy-render app-invites">
            {invites.map((inv) => (
              <li key={inv.email} className="list-row">
                <span className="avatar sm">{inv.email[0]?.toUpperCase()}</span>
                <span className="list-col-grow flex flex-col min-w-0">
                  <span className="truncate">{inv.email}</span>
                  <span className="text-sm text-muted-foreground">
                    invited by {inv.invitedBy} · <code>{inv.sent}</code> ago
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <RoleBadge role={inv.role} />
                  {inv.expired ? (
                    <span className="badge ghost">expired</span>
                  ) : (
                    <span className="badge warning">pending</span>
                  )}
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => resend(inv.email)}
                    data-tooltip={
                      inv.expired ? "Send a fresh link" : "Send again"
                    }
                    data-placement="left"
                  >
                    Resend
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <div className="card-footer items-center text-sm text-muted-foreground">
            Invites expire after 7 days.
            <span className="space" />
            <kbd>I</kbd> new invite
          </div>
        </div>
      </section>

      <section
        className="grid sm hidden open:grid"
        data-open={tab === "Roles" ? "" : undefined}
      >
        {ROLES.map((role) => {
          const count = members.filter((m) => m.role === role).length;
          return (
            <div
              key={role}
              className={`card background-glow ${ROLE_SCHEME[role]}`}
            >
              <div className="card-meta items-center">
                <strong>{role}</strong>
                <span className="space" />
                <span className="badge ghost pill">{count}</span>
              </div>
              <div className="card-content">
                <p>{ROLE_INFO[role].summary}</p>
              </div>
              <div className="card-footer items-center">
                <code>{ROLE_INFO[role].permissions.length} permissions</code>
                <span className="space" />
                <button
                  className="btn ghost"
                  type="button"
                  popoverTarget={`role-detail-${role}`}
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <div
        id="quick-actions"
        popover="auto"
        className="radial-menu fixed app-quick-actions"
      >
        <button
          type="button"
          className="radial-item"
          popoverTarget="quick-actions"
          popoverTargetAction="hide"
          onClick={() => dialog.current?.showModal()}
        >
          Invite
        </button>
        <button
          type="button"
          className="radial-item"
          popoverTarget="quick-actions"
          popoverTargetAction="hide"
          onClick={() =>
            showNotice(`Exporting ${members.length} members as CSV`)
          }
        >
          Export
        </button>
        <button
          type="button"
          className="radial-item"
          popoverTarget="quick-actions"
          popoverTargetAction="hide"
          onClick={() => navigate({ to: "/forms" })}
        >
          Settings
        </button>
      </div>
      <button
        type="button"
        className="radial-trigger fixed"
        popoverTarget="quick-actions"
        aria-label="Quick actions"
      >
        +
      </button>

      <nav className="tabs bottom rounded lg:hidden" aria-label="Team sections">
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            className="tab ghost"
            aria-current={tab === name ? "page" : undefined}
            onClick={() => setTab(name)}
          >
            <span className="icon" aria-hidden="true">
              {name === "Members" ? "◉" : name === "Invites" ? "✉" : "◈"}
            </span>
            <span className="text-xs">{name}</span>
          </button>
        ))}
      </nav>

      <dialog className="modal" ref={dialog}>
        <div className="card background-raised">
          <div className="card-meta">
            <strong>Invite member</strong>
            <span className="space" />
            <span className="badge ghost pill">{pending} pending</span>
          </div>
          <form method="dialog" onSubmit={invite}>
            <div className="card-content">
              <fieldset>
                <label htmlFor="invite-email">Email</label>
                <input
                  id="invite-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="off"
                  placeholder="name@company.com"
                />
                <label htmlFor="invite-role">Role</label>
                <select id="invite-role" name="role" defaultValue="viewer">
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </fieldset>
              <p className="text-sm text-muted-foreground">
                The invite link expires in 7 days. Press <kbd>Esc</kbd> to
                cancel.
              </p>
            </div>
            <div className="card-footer justify-end">
              <button
                type="button"
                data-role="cancel"
                onClick={() => dialog.current?.close()}
              >
                Cancel
              </button>
              <button type="submit" data-role="apply">
                Send invite
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {ROLES.map((role) => (
        <div
          key={role}
          id={`role-detail-${role}`}
          popover="auto"
          className="popover"
        >
          <div className="flex items-center gap-2">
            <strong>{role}</strong>
            <RoleBadge role={role} />
            <span className="space" />
            <button
              className="btn ghost icon"
              type="button"
              popoverTarget={`role-detail-${role}`}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="text-muted-foreground">{ROLE_INFO[role].summary}</p>
          <ul className="list">
            {ROLE_INFO[role].permissions.map((perm) => (
              <li key={perm} className="list-row">
                <span className="status success" aria-hidden="true" />
                <code className="list-col-grow">{perm}</code>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div
        id="member-profile"
        popover="auto"
        className="drawer"
        data-placement="right"
      >
        {profile ? (
          <>
            <div className="panel-header top">
              <span className="avatar lg">{initials(profile.name)}</span>
              <span className="panel-header-title">
                <strong>{profile.name}</strong>
                <br />
                <span className="text-muted-foreground">{profile.email}</span>
              </span>
              <button
                className="btn ghost icon panel-shrink"
                type="button"
                popoverTarget="member-profile"
                aria-label="Close profile"
              >
                ×
              </button>
            </div>
            <ul className="list">
              <li className="list-row">
                <span className="list-col-grow">Role</span>
                <RoleBadge role={profile.role} />
              </li>
              <li className="list-row">
                <span className="list-col-grow">Status</span>
                <PresenceDot presence={profile.presence} />
              </li>
              <li className="list-row">
                <span className="list-col-grow">Last active</span>
                <code>{profile.lastActive}</code>
              </li>
              <li className="list-row">
                <span className="list-col-grow">Joined</span>
                <code>{profile.joined}</code>
              </li>
              <li className="list-row">
                <span className="list-col-grow">Location</span>
                <span>{profile.location}</span>
              </li>
              <li className="list-row">
                <span className="list-col-grow">Permissions</span>
                <span className="badge ghost">
                  {ROLE_INFO[profile.role].permissions.length}
                </span>
              </li>
            </ul>
            <div className="panel-header bottom">
              <button
                className="btn ghost"
                type="button"
                onClick={() => changeRole(profile.id)}
              >
                Change role → {nextRole(profile.role)}
              </button>
              <span className="space" />
              <button
                className="btn danger"
                type="button"
                popoverTarget="member-profile"
                popoverTargetAction="hide"
                onClick={() => remove(profile)}
              >
                Remove
              </button>
            </div>
          </>
        ) : (
          <div className="empty">
            <span className="empty-title">No member selected</span>
            <span>Pick a member from the table.</span>
          </div>
        )}
      </div>

      <div
        ref={noticeEl}
        id="team-notice"
        popover="manual"
        className="notice success top-end"
        role="status"
      >
        <span className="icon" aria-hidden="true">
          ✓
        </span>
        <span>{notice}</span>
        <button
          className="btn ghost icon"
          type="button"
          popoverTarget="team-notice"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </DashboardShell>
  );
}
