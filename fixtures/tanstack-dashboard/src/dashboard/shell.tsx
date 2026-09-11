import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { config } from "../../luz.config";

type NavItem = {
  to: "/" | "/forms" | "/overlays" | "/layout" | "/content" | "/about";
  label: string;
  scheme: "primary" | "secondary" | "tertiary" | "quaternary" | "neutral";
};

const NAV: ReadonlyArray<{ title: string; items: readonly NavItem[] }> = [
  {
    title: "Workspace",
    items: [
      { to: "/", label: "Overview", scheme: "primary" },
      { to: "/forms", label: "Settings", scheme: "secondary" },
      { to: "/overlays", label: "Team", scheme: "tertiary" },
    ],
  },
  {
    title: "Library",
    items: [
      { to: "/layout", label: "Projects", scheme: "quaternary" },
      { to: "/content", label: "Notes", scheme: "neutral" },
      { to: "/about", label: "About", scheme: "neutral" },
    ],
  },
];

function NavList() {
  return (
    <nav className="flex-col grow overflow-auto" aria-label="Secciones">
      {NAV.map((group) => (
        <ul key={group.title} className="list nav">
          <li className="list-title">{group.title}</li>
          {group.items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`list-row ${item.scheme}`}
                activeOptions={{ exact: true }}
              >
                <span className="status" aria-hidden="true" />
                <span className="list-col-grow">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="panel-header top gap-3">
      <span className="avatar sm solid primary" aria-hidden="true">
        lz
      </span>
      <span className="panel-header-title">
        <strong>luz</strong>
      </span>
      <span className="badge ghost pill">v0.3</span>
    </div>
  );
}

function User() {
  return (
    <div className="panel-header bottom gap-3">
      <span className="avatar sm">CS</span>
      <span className="panel-header-title">
        <strong>Carlos</strong>
        <br />
        <span className="text-muted-foreground">admin</span>
      </span>
      <button
        className="btn ghost icon"
        type="button"
        popoverTarget="user-menu"
        aria-label="Cuenta"
      >
        ⋯
      </button>
      <div id="user-menu" popover="auto" className="menu">
        <button className="menu-item" type="button">
          Profile
        </button>
        <button className="menu-item" type="button">
          Preferences <kbd>,</kbd>
        </button>
        <hr />
        <button className="menu-item danger" type="button">
          Sign out
        </button>
      </div>
    </div>
  );
}

function Statusbar() {
  return (
    <footer className="panel-header bottom app-statusbar">
      <span className="status success" aria-hidden="true" />
      <span>luzVite</span>
      <code className="text-xs">@import "@d00m-gui/luz/luz.css"</code>
      <span className="space" />
      <span>{config.mode}</span>
      <span>{config.harmony}</span>
      <span>{config.primary}</span>
    </footer>
  );
}

export function DashboardShell({
  title,
  description,
  actions,
  aside,
  children,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV.flatMap((g) => g.items).find((i) => i.to === pathname);

  return (
    <div className="shell app">
      <div
        id="mobile-nav"
        popover="auto"
        className="drawer"
        data-placement="left"
      >
        <Brand />
        <NavList />
      </div>

      <aside className="shell-pane fixed app-sidebar max-lg:hidden">
        <Brand />
        <NavList />
        <User />
      </aside>

      <div className="shell-pane">
        <header className="panel-header top app-topbar gap-3">
          <button
            popoverTarget="mobile-nav"
            className="drawer-trigger panel-shrink lg:hidden"
            type="button"
            aria-label="Abrir menú"
          >
            <span className="drawer-icon">
              <span />
              <span />
              <span />
            </span>
          </button>
          <nav
            className="breadcrumbs panel-header-title"
            aria-label="Ubicación"
          >
            <ol>
              <li>
                <Link to="/">luz</Link>
              </li>
              <li aria-current="page">{current?.label ?? title}</li>
            </ol>
          </nav>
          <label className="join panel-shrink app-search max-lg:hidden">
            <input
              type="search"
              className="w-56"
              placeholder="Buscar…"
              aria-label="Buscar"
            />
            <kbd>⌘K</kbd>
          </label>
        </header>

        <main className="shell-body">
          <div className="page">
            <header className="page-header">
              <div className="page-header-title">
                <h1>{title}</h1>
                {description ? <p>{description}</p> : null}
              </div>
              {actions ? (
                <div className="flex items-center gap-2 shrink-0">
                  {actions}
                </div>
              ) : null}
            </header>
            <div className={aside ? "page-body with-aside" : "page-body"}>
              <div className="stack">{children}</div>
              {aside ? <aside className="page-aside">{aside}</aside> : null}
            </div>
          </div>
        </main>

        <Statusbar />
      </div>
    </div>
  );
}
