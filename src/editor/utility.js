function getLanguageByFileName(fileName) {
    const extensionToLanguageMap = {
        'js': 'javascript',
        'py': 'python',
        'html': 'html',
        'css': 'css',
        // Add more mappings as needed
    };

    const extension = fileName.split('.').pop();
    return extensionToLanguageMap[extension] || 'plaintext'; // default to plain text if no mapping found
}

export { getLanguageByFileName };
