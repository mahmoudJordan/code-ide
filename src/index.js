import { navigate, navigationPanel } from './editor/fileNavigator';
import { getProjectFiles } from './http/service';
import './assets/style.css';
import LayoutManager from './layout/layoutManager';

(async () => {
    try {

        let project = {
            name: `ide`,
            fileNodes: []
        }

        const response = await getProjectFiles(project.name);
        project.fileNodes = response.data;

        navigationPanel(project, document.getElementById('sidebar'))
        navigate(project.name, project.fileNodes.find(x => x.type == `file`));

        const layoutManager = new LayoutManager();
        layoutManager.initialize();

    } catch (error) {
        console.error(error);
    }

})();