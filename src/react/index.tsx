import { reset } from "@/tools/reset";
import { luz } from "../luz";
import { base } from "../tools/base";
import { setup } from "../tools/setup";

export function LuzReact({ config }: any): React.ReactNode {
  const { variables, tokens } = luz(config);

  const style = `
    ${reset()}
		${setup(tokens)}
		:root {
			${variables}
		}
		${base(tokens)}
	`;

  return (
    <style href="luz" precedence="high">
      {style}
    </style>
  );
}
