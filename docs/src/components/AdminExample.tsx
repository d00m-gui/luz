import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";

const NAV_ITEMS = ["Dashboard", "Users", "Orders", "Settings"] as const;

const STATS = [
  { label: "Total users", value: "1,284" },
  { label: "Monthly revenue", value: "$48,920" },
  { label: "Open tickets", value: "12" },
] as const;

const USERS = [
  { name: "Ada Lovelace", email: "ada@example.com", role: "Admin", status: "Active" },
  { name: "Grace Hopper", email: "grace@example.com", role: "Editor", status: "Active" },
  { name: "Alan Turing", email: "alan@example.com", role: "Viewer", status: "Pending" },
  { name: "Katherine Johnson", email: "katherine@example.com", role: "Editor", status: "Active" },
  { name: "Margaret Hamilton", email: "margaret@example.com", role: "Admin", status: "Suspended" },
] as const;

/** User-avatar menu in the header bar — a natural fit for `DropdownMenu` +
 *  `Avatar` in an admin screen's chrome. */
function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center rounded border border-transparent focus:border-ring">
        <Avatar size="sm">
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ada Lovelace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** "Create new" action in the toolbar — a natural fit for `Dialog`. */
function NewUserDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm" />}>New user</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            Send an invite to join this workspace.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="admin-new-user-email">Email</FieldLabel>
          <input
            id="admin-new-user-email"
            className="w-full h-16 rounded border px-5 text-9"
            placeholder="new.user@example.com"
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  // `.card` uses `container-type: inline-size` for its cqi-based fluid
  // tokens — as a flex child with no explicit width, that creates a
  // circular sizing dependency Chrome resolves by collapsing to 0 width
  // (same root cause as the `.playground-preview > div` fix in zed.css).
  // `flex-1` gives it a real flex-basis, breaking the cycle.
  return (
    <div className="card flex-1">
      <div className="card-content">
        <div className="flex flex-col gap-3">
          <span className="text-8 text-muted-foreground">{label}</span>
          <span className="text-16 font-semibold">{value}</span>
        </div>
      </div>
    </div>
  );
}

/** A minimal admin-panel-style screen composed from luz's plain-HTML layout
 *  utilities (sidebar nav, header bar), the shared `.card` styling (stat
 *  row), a classless native `<table>` (already styled by luz's reset), and
 *  two of the real shadcn-adapted components (`DropdownMenu` + `Avatar` for
 *  the user menu, `Dialog` for the "create new" action) — showing the
 *  primitives compose into a real screen, not just render in isolation. */
export function AdminExample() {
  return (
    <div className="flex rounded border" style={{ minHeight: "26rem" }}>
      <nav className="flex flex-col gap-3 p-8 shrink-0 bg-card">
        <div className="text-8 text-muted-foreground p-5">Acme Inc.</div>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a
                href="#"
                className="flex p-5 rounded text-9 no-underline hover:bg-accent hover:text-accent-foreground"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center justify-between gap-8 p-8 bg-card">
          <h4>Users</h4>
          <div className="flex items-center gap-6">
            <NewUserDialog />
            <UserMenu />
          </div>
        </header>

        <div className="flex flex-col gap-10 p-10">
          <div className="flex flex-wrap gap-8">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
