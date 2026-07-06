import { reset } from "@/tools/reset";
import { luz, type LuzConfig } from "../luz";
import { base } from "../tools/base";
import { setup } from "../tools/setup";

export function LuzReact({ config }: { config: LuzConfig }): React.ReactNode {
  const { variables, tokens, propierties } = luz(config);
  const style = `
    ${propierties}
    ${reset()}
		${setup(tokens)}
		:root {
			${variables}
		}
		${base(tokens)}
	`;
  // console.log("STYLE", style.trim());

  return (
    <style href="luz" precedence="high">
      {style.trim()}
    </style>
  );
}
