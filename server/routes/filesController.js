const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const filesController = express.Router();


// Utility function for basic path sanitization (This needs more robust handling for production)
const getSafePath = (filePath) => path.join(__dirname,  filePath);

// Open (Read) a file
filesController.get('/open', async (req, res) => {
    const { filePath } = req.query;
    try {
        const fullPath = getSafePath(filePath);
        const content = await fs.readFile(fullPath, 'utf8');
        res.send(content);
    } catch (error) {
        res.status(404).send('File not found');
    }
});

// Create a file  
filesController.post('/create', async (req, res) => {
    const { filePath, content } = req.body;
    try {
        const fullPath = getSafePath(filePath);
        await fs.writeFile(fullPath, content);
        res.send('File created successfully');
    } catch (error) {
        res.status(500).send('Error creating the file');
    }
});

// Delete a file
filesController.delete('/delete', async (req, res) => {
    const { filePath } = req.query;
    try {
        const fullPath = getSafePath(filePath);
        await fs.unlink(fullPath);
        res.send('File deleted successfully');
    } catch (error) {
        res.status(404).send('File not found');
    }
});

// Copy a file
filesController.post('/copy', async (req, res) => {
    const { sourcePath, destinationPath } = req.body;
    try {
        const fullSourcePath = getSafePath(sourcePath);
        const fullDestinationPath = getSafePath(destinationPath);
        await fs.copyFile(fullSourcePath, fullDestinationPath);
        res.send('File copied successfully');
    } catch (error) {
        res.status(500).send('Error copying the file');
    }
});

// Cut (Move) a file
filesController.post('/move', async (req, res) => {
    const { sourcePath, destinationPath } = req.body;
    try {
        const fullSourcePath = getSafePath(sourcePath);
        const fullDestinationPath = getSafePath(destinationPath);
        await fs.rename(fullSourcePath, fullDestinationPath);
        res.send('File moved successfully');
    } catch (error) {
        res.status(500).send('Error moving the file');
    }
});

// Search a folder or path for a string in files content (Simple implementation)
filesController.get('/search', async (req, res) => {
    const { directoryPath, searchString } = req.query;
    try {
        const fullDirectoryPath = getSafePath(directoryPath);
        const files = await fs.readdir(fullDirectoryPath);
        let foundFiles = [];

        for (const file of files) {
            const content = await fs.readFile(path.join(fullDirectoryPath, file), 'utf8');
            if (content.includes(searchString)) {
                foundFiles.push(file);
            }
        }

        res.json(foundFiles);
    } catch (error) {
        res.status(500).send('Error searching the directory');
    }
});

// Find files that match a regex (in the file name)
filesController.get('/find', async (req, res) => {
    const { directoryPath, regexPattern } = req.query;
    try {
        const fullDirectoryPath = getSafePath(directoryPath);
        const files = await fs.readdir(fullDirectoryPath);
        const regex = new RegExp(regexPattern);
        const matchedFiles = files.filter(file => regex.test(file));

        res.json(matchedFiles);
    } catch (error) {
        res.status(500).send('Error finding the files');
    }
});

module.exports = filesController

// export { router as filesController };