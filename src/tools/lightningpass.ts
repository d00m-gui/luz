import { transform, type TransformResult } from "lightningcss";

interface LightParserOptions {
  path: string | false,
  code: string,
  minify?: boolean,
}

export const LightningParser = ({
  path,
  code,
  minify = false,
}: LightParserOptions): TransformResult => {
  return transform({
    filename: path || "luz",
    code: Buffer.from(code),
    minify,
    sourceMap: false,
  });
};
