import logSymbols from "log-symbols";
import { toError } from "@utils/index.js";

const prefix = "[StelliaJS]";
export const logger = {
	info: (message: string): void => {
		console.log(`${logSymbols.info} ${prefix} ${message}`);
	},
	success: (message: string): void => {
		console.log(`${logSymbols.success} ${prefix} ${message}`);
	},
	warn: (message: string): void => {
		console.warn(`${logSymbols.warning} ${prefix} ${message}`);
	},
	error: (message: string): void => {
		console.error(`${logSymbols.error} ${prefix} ${message}`);
	},
	errorWithInformation: (message: string, error: unknown): void => {
		console.error(`${logSymbols.error} ${prefix} ${message}:`, toError(error));
	}
};
