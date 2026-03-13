import { lui } from "../../../dist/react";
export function MeterSample() {
	return (
		<lui.card>
			<h2>meter</h2>
			<div className="card-content">
				<article>
					<lui.meter.root value={24}>
						<lui.meter.label className="label">
							<p>/home</p>
						</lui.meter.label>
						<lui.meter.value className="value" />
						<lui.meter.track className="track">
							<lui.meter.indicator className="indicator" />
						</lui.meter.track>
					</lui.meter.root>
					<progress value="25" max="100"></progress>
					<progress></progress>
				</article>
			</div>
		</lui.card>
	);
}
