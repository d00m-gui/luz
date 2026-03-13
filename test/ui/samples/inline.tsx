import { lui } from "../../../dist/react";

export function InlineSample() {
	return (
		<lui.card>
			<h2>inline</h2>
			<div className="card-content">
				<article>
					<div className="grid">
						<a href="#">Primary link</a>
						<a href="#" className="secondary">
							Secondary link
						</a>
						<a href="#" className="contrast">
							Contrast link
						</a>
					</div>
					<div className="grid">
						<p>
							<strong>Bold</strong>
						</p>
						<p>
							<em>Italic</em>
						</p>
						<p>
							<u>Underline</u>
						</p>
					</div>
					<div className="grid">
						<p>
							<del>Deleted</del>
						</p>
						<p>
							<ins>Inserted</ins>
						</p>
						<p>
							<s>Strikethrough</s>
						</p>
					</div>
					<div className="grid">
						<p>
							<small>Small </small>
						</p>
						<p>
							Text <sub>Sub</sub>
						</p>
						<p>
							Text <sup>Sup</sup>
						</p>
					</div>
					<div className="grid">
						<p>
							<abbr title="Abbreviation" data-tooltip="Abbreviation">
								Abbr.
							</abbr>
						</p>
						<p>
							<kbd>ESC</kbd>
						</p>
						<p>
							<mark>Highlighted</mark>
						</p>
					</div>
				</article>
			</div>
		</lui.card>
	);
}
