import logSymbols from "log-symbols";

export const logger = {
    info: (message: string) => {
        console.log(`${logSymbols.info} ${message}`)
    },
    success: (message: string) => {
        console.log(`${logSymbols.success} ${message}`)
    },
    warn: (message: string) => {
        console.warn(`${logSymbols.warning} ${message}`)
    },
    error: (message: string) => {
        console.error(`${logSymbols.error} ${message}`)
    }
}