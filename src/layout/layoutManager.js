


class LayoutManager {

    constructor() {
        this.leftPane = document.querySelector("#sidebar");
        this.rightPane = document.querySelector("#editorContainer");
        this.gutter = document.querySelector(".gutter");
        this.isDragging = false;
    }

    initialize() {
        this.gutter.addEventListener('mousedown', this.mouseDownHandler.bind(this));
    }

    mouseDownHandler(e) {
        e.preventDefault();
        this.isDragging = true;
        
        document.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
        document.addEventListener('mouseup', this.mouseUpHandler.bind(this));
    }

    mouseMoveHandler(e) {
        if (!this.isDragging) {
            return;
        }
        const dx = e.clientX - this.leftPane.getBoundingClientRect().right;
        const leftPaneWidth = this.leftPane.offsetWidth + dx;
        this.leftPane.style.width = `${leftPaneWidth}px`;
    }

    mouseUpHandler(e) {
        if (this.isDragging) {
            document.removeEventListener('mousemove', this.mouseMoveHandler.bind(this));
            document.removeEventListener('mouseup', this.mouseUpHandler.bind(this));
            this.isDragging = false;
        }
    }
}




// Export an instance of EditorManager
export { LayoutManager as default };
