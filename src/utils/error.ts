export function toError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === "object") {
        return new Error(JSON.stringify(error));
    }

    return new Error(String(error));
}