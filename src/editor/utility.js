import { editorLanguages } from "./supportedLanguages"

function getLanguageByFileName(fileName) {
    const languageExtensionMap = editorLanguages.reduce((acc, { language, extension }) => {
 
        let ext = extension.includes(".")
            ? extension.substring(1)
            : extension;


        acc[ext] = language;
        return acc;
    }, {});

    const extensionToLanguageMap = languageExtensionMap;

    const extension = fileName.split('.').pop();
    return extensionToLanguageMap[extension] || 'plaintext'; // default to plain text if no mapping found
}

export { getLanguageByFileName };
