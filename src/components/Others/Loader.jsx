import React from 'react';

function Loader() {
	return (
		<main className='loading'>
			<svg
				className="bike"
				viewBox="0 0 48 30"
				width="48px"
				height="30px"
			>
				<g
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1"
				>
					<g transform="translate(9.5,19)">
						<circle
							className="bike__tire"
							r="9"
							stroke-dasharray="56.549 56.549"
						/>
						<g
							className="bike__spokes-spin"
							stroke-dasharray="31.416 31.416"
							stroke-dashoffset="-23.562"
						>
							<circle
								className="bike__spokes"
								r="5"
							/>
							<circle
								className="bike__spokes"
								r="5"
								transform="rotate(180,0,0)"
							/>
						</g>
					</g>
					<g transform="translate(24,19)">
						<g
							className="bike__pedals-spin"
							stroke-dasharray="25.133 25.133"
							stroke-dashoffset="-21.991"
							transform="rotate(67.5,0,0)"
						>
							<circle
								className="bike__pedals"
								r="4"
							/>
							<circle
								className="bike__pedals"
								r="4"
								transform="rotate(180,0,0)"
							/>
						</g>
					</g>
					<g transform="translate(38.5,19)">
						<circle
							className="bike__tire"
							r="9"
							stroke-dasharray="56.549 56.549"
						/>
						<g
							className="bike__spokes-spin"
							stroke-dasharray="31.416 31.416"
							stroke-dashoffset="-23.562"
						>
							<circle
								className="bike__spokes"
								r="5"
							/>
							<circle
								className="bike__spokes"
								r="5"
								transform="rotate(180,0,0)"
							/>
						</g>
					</g>
					<polyline
						className="bike__seat"
						points="14 3,18 3"
						stroke-dasharray="5 5"
					/>
					<polyline
						className="bike__body"
						points="16 3,24 19,9.5 19,18 8,34 7,24 19"
						stroke-dasharray="79 79"
					/>
					<path
						className="bike__handlebars"
						d="m30,2h6s1,0,1,1-1,1-1,1"
						stroke-dasharray="10 10"
					/>
					<polyline
						className="bike__front"
						points="32.5 2,38.5 19"
						stroke-dasharray="19 19"
					/>
				</g>
			</svg>
		</main>
	);
}

export default Loader;
