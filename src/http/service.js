

const baseUrl = 'http://localhost:3000'
import axios from 'axios';
import { Uri } from 'monaco-editor';



async function getProjectFiles(projectIdentifier) {
    return await axios.get(`${baseUrl}/projects/${projectIdentifier}`);
}


async function getFileContent(projectIdentifier, filePath) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${baseUrl}/projects/${projectIdentifier}/file/${encodeURI(filePath)}`);
            if (typeof response.data === 'object') {
                resolve(JSON.stringify(response.data , null, "\t"));
            } else {
                resolve(response.data);
            }
        }
        catch (e) {
            console.error(e);
            reject(e);
        }

    })

}




export { getProjectFiles, getFileContent };
