
type Handler = {
	sigName: string,
	fn: Function
}

const SIGNALS = ['SIGINT', 'SIGTERM'] as const;
const TERM_SIGNALS = ['SIGINT', 'SIGTERM'] as const;

const normaliseName = (str: string): string => str.toLowerCase().replace(/^sig/, '');

let handlers: Handler[] = []

SIGNALS.forEach(signal => {
  process.on(signal, () => {
		handlers
			.filter(h => normaliseName(h.sigName) === normaliseName(signal))
			.forEach(h => {
				h.fn.call(null);
			})
		;
		if (TERM_SIGNALS.includes(signal)) {
			process.nextTick(() => process.exit(0));
		}
	});
});

export default {
	on: (sigNames: Array<string>, fn: () => any) => {
		sigNames.forEach(sigName => handlers.push({ sigName, fn }));
	}
};
