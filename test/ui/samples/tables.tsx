import { lui } from "../../../dist/react";

export function TablesSample() {
	return (
		<lui.card>
			<h2>tables</h2>
			<div className="card-content">
				<article>
					<table>
						<thead>
							<tr>
								<th>Data</th>
								<th>Tabulated</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>x 6.7235</td>
								<td>z 309.2939</td>
							</tr>
							<tr>
								<td>y 6.7235</td>
								<td>w 309.2939</td>
							</tr>
						</tbody>
					</table>
				</article>
			</div>
		</lui.card>
	);
}
