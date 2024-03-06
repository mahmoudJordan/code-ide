// ES6 module imports
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { getLanguageByFileName } from './utility';

class EditorManager {
  currentTabId = 0;
  currentTabsCount = 0;
  tabOrder = [];

  constructor() {
    this.editorInstances = {};
    this.currentTabId = 0;
    monaco.editor.setTheme('vs-dark');
    document.querySelector("#addFile-tab").onclick = () => {
      this.addTab(`untitled${this.currentTabsCount}`);
    }
  }

  createEditorInstance(tabId, language = 'javascript', value = '') {
    const editorContainer = document.getElementById('editorContainer');
    const editorDiv = document.createElement('div');
    editorDiv.id = `editor${tabId}`;
    editorDiv.classList.add('editor', 'm-editor');
    editorDiv.style.height = '100vh';
    editorContainer.appendChild(editorDiv);

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

  addTab(tabId, fileName = 'Untitled', fileContent = '// Your code here') {

    const tabButton = document.createElement('button');
    tabButton.textContent = fileName;
    tabButton.className = 'tab';
    tabButton.id = `tab${tabId}`;
    tabButton.onclick = () => this.switchTab(tabId);


    const closeTabBtn = document.createElement('img');
    closeTabBtn.setAttribute("src", "assets/times-solid-svgrepo-com.svg");
    closeTabBtn.classList.add("tab-close-button");

    closeTabBtn.onclick = (e) => {
      e.stopPropagation();
      this.removeTab(tabId, tabButton)
    }

    tabButton.append(closeTabBtn);


    const tabsContainer = document.getElementById('tabs');
    tabsContainer.insertBefore(tabButton, tabsContainer.lastElementChild);

    const language = getLanguageByFileName(fileName);
    const editorInstance = this.createEditorInstance(tabId, language, fileContent);
    this.editorInstances[tabId] = editorInstance;
    this.currentTabsCount++;

    this.tabOrder.push(tabId);
    this.switchTab(tabId);
  }

  removeTab(tabId, tabButton) {
    const index = this.tabOrder.indexOf(tabId);
    if (index !== -1) {
      this.tabOrder.splice(index, 1);
      --this.currentTabsCount;
      delete this.editorInstances[tabId];
      tabButton.parentNode.removeChild(tabButton);
      const editor = document.getElementById(`editor${tabId}`);
      editor.parentElement.removeChild(editor);


      // Determine the previous tab to switch to, if possible
      const prevTabId = this.tabOrder[Math.max(0, index - 1)]; // Ensures it doesn't go below 0
      if (prevTabId !== undefined) {
        this.switchTab(prevTabId);
      } else {
        // If there's no previous tab (array is empty), reset currentTabId to an initial state or handle appropriately
        this.currentTabId = 0;
        // Additional logic may be required here to handle the UI state when no tabs are open.
      }
    }
  }
}




// Export an instance of EditorManager
const editorManager = new EditorManager();
export { editorManager as default };
