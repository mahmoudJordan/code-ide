// ES6 module imports
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { getLanguageByFileName } from './utility';

class EditorManager {
  constructor() {
    this.editorInstances = {};
    this.currentTabId = 0;
    monaco.editor.setTheme('vs-dark'); // Set theme for monaco
  }

  createEditorInstance(tabId, language = 'javascript', value = '// Your code here') {
    const editorContainer = document.getElementById('editorContainer'); // Reference to the container
    const editorDiv = document.createElement('div');
    editorDiv.id = `editor${tabId}`;
    editorDiv.classList.add('editor', 'm-editor');
    editorDiv.style.height = '100vh';
    editorContainer.appendChild(editorDiv); // Append to the container

    return monaco.editor.create(editorDiv, {
      value,
      language,
      theme: 'vs-dark',
      fontFamily: "Consolas, 'Courier New', monospace",
      fontSize: 14,
      automaticLayout: true,
    });
  }

  switchTab(tabId) {
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => tab.classList.remove('active'));

    const activeTab = document.getElementById(`tab${tabId}`);
    activeTab?.classList.add('active');

    // Hide all editors
    const editors = document.querySelectorAll('.editor');
    editors.forEach(editor => editor.style.display = 'none');

    // Show the selected editor using the correct ID
    const currentEditor = document.getElementById(`editor${tabId}`);
    if (currentEditor) {
      currentEditor.style.display = 'block';
    }
    this.currentTabId = tabId;
  }

  addTab(tabId = ++this.currentTabId, fileName = 'Untitled', fileContent = '// Your code here') {
    const tabButton = document.createElement('button');
    tabButton.textContent = fileName;
    tabButton.className = 'tab';
    tabButton.id = `tab${tabId}`;
    tabButton.onclick = () => this.switchTab(tabId);

    const tabsContainer = document.getElementById('tabs');
    tabsContainer.insertBefore(tabButton, tabsContainer.lastElementChild);

    const language = getLanguageByFileName(fileName);
    const editorInstance = this.createEditorInstance(tabId, language, fileContent);
    this.editorInstances[tabId] = editorInstance;

    this.switchTab(tabId);
  }
}

// Export an instance of EditorManager
const editorManager = new EditorManager();
export { editorManager as default };
