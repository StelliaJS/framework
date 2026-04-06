import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Collection } from "discord.js";
import { type AnyInteractionStructure } from "@structures/index.js";
import { type StructureCustomId } from "@typescript/index.js";

export const requiredFiles = async <InteractionStructure extends AnyInteractionStructure>(directoryPath: string): Promise<Collection<StructureCustomId, InteractionStructure>> => {
	const collection = new Collection<StructureCustomId, InteractionStructure>();
	const filesPath = getAllFilesPath(directoryPath).filter((file) => !file.endsWith(".d.ts") && (file.endsWith(".js") || file.endsWith(".ts")));
	for (const filePath of filesPath) {
		const interactionData = await loadInteraction<InteractionStructure>(filePath);
		const interactionName = "command" in interactionData.data ? interactionData.data.command.name : interactionData.data.name;
		collection.set(interactionName, interactionData);
	}

	return collection;
};

const loadInteraction = async <InteractionStructure extends AnyInteractionStructure>(filePath: string): Promise<InteractionStructure> => {
	const moduleUrl = pathToFileURL(filePath).href;
	const module = await import(moduleUrl);

	return module.default as InteractionStructure;
};

const getAllFilesPath = (dirPath: string, arrayOfFiles: string[] = []): string[] => {
	const files = readdirSync(dirPath);
	for (const file of files) {
		const fullPath = path.join(dirPath, file);
		if (statSync(fullPath).isDirectory()) {
			arrayOfFiles = getAllFilesPath(fullPath, arrayOfFiles);
		} else {
			arrayOfFiles.push(path.resolve(fullPath));
		}
	}

	return arrayOfFiles;
};
