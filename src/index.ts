import { luz as createLuz } from "./luz";

export const luz: typeof createLuz = createLuz;

export type { LuzConfig, LuzResult, LuzTokens, TokenSettings } from "./luz";
export { TYPE_SCALES, FLUID_RANGES } from "./tools/sizes";
export type { TypeScaleName, FluidRangeName } from "./tools/sizes";
