#!/usr/bin/env node
import { mkdirSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../skills/luz", import.meta.url));
const directory = join(process.cwd(), ".agents", "skills");
const destination = join(directory, "luz");

try {
  mkdirSync(directory, { recursive: true });
  symlinkSync(
    source,
    destination,
    process.platform === "win32" ? "junction" : "dir",
  );
  console.log(`Skill registrada en ${destination}`);
} catch (error) {
  console.error(
    error.code === "EEXIST"
      ? `No se modificó ${destination}: el destino ya existe.`
      : error.message,
  );
  process.exitCode = 1;
}
