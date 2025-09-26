import logSymbols from "log-symbols";

const prefix = "[StelliaJS]";
export const logger = {
	info: (message: string) => {
		console.log(`${logSymbols.info} ${prefix} ${message}`);
	},
	success: (message: string) => {
		console.log(`${logSymbols.success} ${prefix} ${message}`);
	},
	warn: (message: string) => {
		console.warn(`${logSymbols.warning} ${prefix} ${message}`);
	},
	error: (message: string) => {
		console.error(`${logSymbols.error} ${prefix} ${message}`);
	}
};
