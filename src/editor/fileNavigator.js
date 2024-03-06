import editorManager from './editorManager'; // Assuming editorManager is the class instance exported from editorTabPanel
import { getFileContent } from '../http/service';
import { getIconUrlByName, getIconUrlForFilePath } from 'vscode-material-icons';

const ICONS_URL = '/assets/material-icons';

function getFileIconElement(node) {

    const iconUrl = node.type === "file"
        ? getIconUrlForFilePath(node.name, ICONS_URL)
        : getIconUrlByName("folder", ICONS_URL);

    const iconImg = document.createElement('img');
    iconImg.src = iconUrl;
    iconImg.classList.add("file-icon");
    return iconImg;
}

function navigationPanel(project, rootElement) {
    const sidebarProjectName = rootElement.querySelector('.sidebar-project-name');
    sidebarProjectName.textContent = project.name;
    const sidebarFilesContainer = rootElement.querySelector('.sidebar-files');
    buildFolderNavigator(project.name, project.fileNodes, sidebarFilesContainer);
}

function buildFolderNavigator(projectName, nodes, parentElement) {
    sortNodes(nodes);
    nodes.forEach(node => {
        const element = document.createElement('div');
        element.textContent = node.name;
        element.classList.add(node.type);
        parentElement.appendChild(element);
        element.prepend(getFileIconElement(node));

        if (node.type === 'folder') {
            const chevron = document.createElement('span');
            chevron.className = "chevron down";
            element.append(chevron);

            const childrenContainer = document.createElement('div');
            childrenContainer.className = "file-inside-folder";
            childrenContainer.style.display = 'none';
            element.appendChild(childrenContainer);

            element.addEventListener('click', (e) => {
                const isExpanded = childrenContainer.style.display !== 'none';
                childrenContainer.style.display = isExpanded ? 'none' : 'block';
                chevron.className = isExpanded ? "chevron down" : "chevron up";
                element.classList.toggle('folder-expanded', !isExpanded);
                e.stopPropagation();
            });

            buildFolderNavigator(projectName, node.children, childrenContainer);
        } else if (node.type === 'file') {
            element.addEventListener('click', async (e) => {
                e.stopPropagation();
                await navigate(projectName, node);
            });
        }
    });
}

async function navigate(projectName, node) {
    const tabId = `file_${node.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const fileName = node.name;
    let fileContent = node.content ?? await getFileContent(projectName, node.filePath);

    if (!editorManager.editorInstances[tabId]) {
        editorManager.addTab(tabId, fileName, fileContent);
    } else {
        editorManager.switchTab(tabId);
    }
}

function sortNodes(nodes) {
    nodes.sort((a, b) => a.type === "folder" && b.type !== "folder" ? -1 : a.type !== "folder" && b.type === "folder" ? 1 : 0);
}

// Export the necessary functions
export { buildFolderNavigator, navigate, navigationPanel };
