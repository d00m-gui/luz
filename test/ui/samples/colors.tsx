import { lui } from "../../../src/react";
import { css } from "../../../src/tools/css";

export function ColorsSample({ ...props }) {
	const { colors } = props;
	return (
		<lui.card>
			<h2>colors</h2>
			<div className="colors">
				{colors &&
					Object.entries(colors).map(([color], idx: number) => {
						if (color === "primary" || color === "secondary" || color === "neutral") return;
						return (
							<div
								key={idx}
								className="color"
								data-tooltip={color}
								style={{ backgroundColor: `var(--${color})`, height: "5px" }}
							></div>
						);
					})}
				<style precedence="high">{ColorsSampleStyle}</style>
			</div>
		</lui.card>
	);
}

const ColorsSampleStyle = css`
	.colors {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		padding: var(--size-20);
		.color {
			min-height: 3rem;
		}
	}
`;
