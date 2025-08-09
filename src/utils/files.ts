import { readdirSync, statSync } from "fs";
import path from "path";
import { Collection } from "discord.js";
import { type AnyInteractionStructure } from "@structures/index.js";
import { type StructureCustomId } from "@typescript/index.js";

export const requiredFiles = async <InteractionStructure extends AnyInteractionStructure>(directoryPath: string): Promise<Collection<StructureCustomId, InteractionStructure>> => {
	const collection = new Collection<StructureCustomId, InteractionStructure>();
	const filesPath = getAllFilesPath(directoryPath).filter((file) => !file.endsWith(".d.ts") && (file.endsWith(".js") || file.endsWith(".ts")));
	for (const filePath of filesPath) {
		const interactionData = await loadInteraction<InteractionStructure>(filePath);
        const interactionName = "command" in interactionData.data ? interactionData.data.command.name : interactionData.data.name
		collection.set(interactionName, interactionData);
	}

	return collection;
};

const loadInteraction = async <InteractionStructure extends AnyInteractionStructure>(filePath: string): Promise<InteractionStructure> => {
	try {
		const module = await import(`file://${filePath}`);
		const data: InteractionStructure = module.default;
		return data;
	} catch (error) {
		throw error;
	}
};

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
};
