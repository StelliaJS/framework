import { Collection } from "discord.js";
import { readdirSync, statSync } from "fs";
import path from "path";
import { CustomId } from "@typescript/index.js";

type LoadFunction = <T>(collection: Collection<CustomId, T>, filePath: string) => void;

export const requiredFiles = <T>(directoryPath: string, loadFunction: LoadFunction): Collection<CustomId, T> => {
    const collection = new Collection<CustomId, T>();
    const filesPath = getAllFilesPath(directoryPath).filter((file) => file.endsWith(".js"));
    filesPath.forEach((filePath) => loadFunction(collection, filePath));

    return collection;
}

export const loadFiles = <T>(collection: Collection<CustomId, T>, filePath: string): Collection<CustomId, T> => {
    try {
        import(`file://${filePath}`).then(({ default: interactionOrEvent }) => {
            const name = interactionOrEvent.data.name;
            collection.set(name, interactionOrEvent);
        });
    } catch (error) {
        throw error;
    }

    return collection;
}

const getAllFilesPath = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
    const files = readdirSync(dirPath);
    files.forEach((file) => {
        if (statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFilesPath(dirPath + "/" + file, arrayOfFiles);
        } else {
            const __dirname = path.resolve();
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}