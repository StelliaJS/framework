import { Collection } from "discord.js";
import { readdirSync, statSync } from "fs";
import path from "path";
import { type AnyInteractionStructure } from "@structures/index.js";
import { type CustomId } from "@typescript/index.js";

export const requiredFiles = async <InteractionStructure extends AnyInteractionStructure>(directoryPath: string): Promise<Collection<CustomId, InteractionStructure>> => {
    const collection = new Collection<CustomId, InteractionStructure>();
    const filesPath = getAllFilesPath(directoryPath).filter((file) => file.endsWith(".ts"));
    for (const filePath of filesPath) {
        const data = await loadInteraction<InteractionStructure>(filePath);
        collection.set(data.data.name, data);
    }

    return collection;
}

const loadInteraction = async <InteractionStructure extends AnyInteractionStructure>(filePath: string): Promise<InteractionStructure> => {
    try {
        const module = await import(`file://${filePath}`);
        const data: InteractionStructure = module.default;
        return data;
    } catch (error) {
        throw error;
    }
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