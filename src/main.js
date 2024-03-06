import { buildFolderNavigator, navigate, navigationPanel } from './editor/fileNavigator';
import { getProjectFiles } from './http/service';
import './assets/style.css';

(async () => {
    try {

        let project = {
            name: `ide`,
            fileNodes: []
        }

        const response = await getProjectFiles(project.name);
        project.fileNodes = response.data;
        project.fileNodes.sort((a , b) => a.type)

        navigationPanel(project, document.getElementById('sidebar'))
        navigate(project.name, project.fileNodes.find(x => x.type == `file`));

    } catch (error) {
        console.error(error);
    }

})();