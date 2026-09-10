import { luz as createLuz } from "./luz";

export const luz: typeof createLuz = createLuz;

export type {
  LuzConfig,
  LuzPalettes,
  LuzResult,
  LuzTokens,
  TokenSettings,
} from "./luz";
export type { OklchSeed } from "./tools/gamut";
export { emitUtilitiesCSS } from "./tools/utilities";
export { TYPE_SCALES, FLUID_RANGES } from "./tools/sizes";
export type { TypeScaleName, FluidRangeName } from "./tools/sizes";
