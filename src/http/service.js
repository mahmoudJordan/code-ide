

const baseUrl = 'http://localhost:3000'
import axios from 'axios';
import { Uri } from 'monaco-editor';



async function getProjectFiles(projectIdentifier) {
    return await axios.get(`${baseUrl}/projects/${projectIdentifier}`);
}


async function getFileContent(projectIdentifier, filePath) {
    return await axios.get(`${baseUrl}/projects/${projectIdentifier}/file/${encodeURI(filePath)}`);
}




export { getProjectFiles, getFileContent };
