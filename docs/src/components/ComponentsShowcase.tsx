import * as React from "react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast, Toaster } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/** One labeled demo block: a heading, a one-line note on what was adapted
 *  away, and the live component underneath. */
function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-8">
      <h4>{title}</h4>
      {note && <p className="description">{note}</p>}
      <div className="p-10 rounded border">{children}</div>
    </section>
  );
}

function AvatarDemo() {
  return (
    <div className="flex items-center gap-8">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="user" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>OK</AvatarFallback>
        </Avatar>
        <AvatarBadge>3</AvatarBadge>
      </div>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  );
}

function DropdownMenuDemo() {
  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [position, setPosition] = React.useState("bottom");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete account</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More tools</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Save page as…</DropdownMenuItem>
            <DropdownMenuItem>Create shortcut…</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Share</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Clear history</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function TabsDemo() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
      <TabsContent value="team">Manage your team members here.</TabsContent>
    </Tabs>
  );
}

function FieldDemo() {
  return (
    <FieldSet>
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="showcase-name">Name</FieldLabel>
          <input
            id="showcase-name"
            className="w-full h-16 rounded border px-5 text-9"
            placeholder="Ada Lovelace"
          />
          <FieldDescription>Your public display name.</FieldDescription>
        </Field>
        <FieldSeparator>and</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="showcase-email">Email</FieldLabel>
          <input
            id="showcase-email"
            className="w-full h-16 rounded border px-5 text-9"
            placeholder="ada@example.com"
            aria-invalid="true"
          />
          <FieldError>A valid email is required.</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

function ToggleDemo() {
  return (
    <div className="flex items-center gap-5">
      <Toggle aria-label="Toggle bold">B</Toggle>
      <Toggle aria-label="Toggle italic" variant="outline">
        I
      </Toggle>
    </div>
  );
}

function ToggleGroupDemo() {
  return (
    <ToggleGroup variant="outline" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        U
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-5">
      <Button
        variant="outline"
        onClick={() =>
          toast.add({
            title: "Event created",
            description: "Saturday, June 7 at 4:00 PM",
          })
        }
      >
        Show toast
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast.add({
            title: "Something went wrong",
            description: "Could not save the event.",
            type: "error",
          })
        }
      >
        Show error toast
      </Button>
      <Toaster />
    </div>
  );
}

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="showcase-dialog-name">Name</FieldLabel>
          <input
            id="showcase-dialog-name"
            className="w-full h-16 rounded border px-5 text-9"
            defaultValue="Ada Lovelace"
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Renders inside the page's shared `<LuzReact>` — see `DocsIsland`. All
 *  nine adapted shadcn (Base UI) registry components, live and interactive,
 *  styled entirely through luz's closed-vocabulary utility classes (see
 *  `src/components/ui/*.tsx` for the adapted source, each with a top-of
 *  -file comment on what changed from upstream). */
export function ComponentsShowcase() {
  return (
    <div className="flex flex-col gap-12">
      <Section id="avatar" title="Avatar">
        <AvatarDemo />
      </Section>
      <Section id="dropdown-menu" title="Dropdown Menu">
        <DropdownMenuDemo />
      </Section>
      <Section id="menubar" title="Menubar">
        <MenubarDemo />
      </Section>
      <Section id="tabs" title="Tabs">
        <TabsDemo />
      </Section>
      <Section id="field" title="Field">
        <FieldDemo />
      </Section>
      <Section id="toggle" title="Toggle">
        <ToggleDemo />
      </Section>
      <Section id="toggle-group" title="Toggle Group">
        <ToggleGroupDemo />
      </Section>
      <Section id="toast" title="Toast">
        <ToastDemo />
      </Section>
      <Section id="dialog" title="Dialog">
        <DialogDemo />
      </Section>
    </div>
  );
}
