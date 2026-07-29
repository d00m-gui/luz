import { lui, luz } from "luz";

if (typeof luz !== "function") {
  throw new TypeError("luz must be a function");
}

if (typeof lui !== "object" || lui === null) {
  throw new TypeError("lui must be an object");
}

globalThis.__luzConsumer = {
  button: lui.button,
  variables: luz({ primary: "#007dea" }).variables,
};
