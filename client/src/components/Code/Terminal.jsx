import { memo } from 'react';

function Output({ output }) {
	const statusId = output?.status;
	let textColor = 'text-white';
	if (statusId && statusId === 3) {
		textColor = 'text-green-500';
	} else if (output) {
		textColor = 'text-red-500';
	}
	if (output?.stderr) {
		return (
			<>
				<div className="my-4 p-4 w-full h-28 bg-[#1f1e1f] rounded-md text-white font-normal text-sm overflow-y-auto cursor-default">
					<pre
						className={`font-normal text-l ${textColor} break-all`}
					>
						{output?.stdout}
					</pre>
				</div>
				<div className="my-4 p-4 w-full h-64 bg-[#1f1e1f] rounded-md text-white font-normal text-sm overflow-auto cursor-default">
					<p className={`font-normal text-l text-red-500 break-all`}>
						{output?.stderr}
					</p>
				</div>
			</>
		);
	}
	return (
		<div className="my-4 p-4 w-full h-96 bg-[#1f1e1f] rounded-md text-white font-normal text-sm overflow-y-auto cursor-default">
			<pre className={`font-normal text-l ${textColor} break-all`}>
				{output?.stdout}
			</pre>
		</div>
	);
}

function Terminal({ output }) {
	return (
		<>
			<Output output={output} />
		</>
	);
}

export default memo(Terminal);
