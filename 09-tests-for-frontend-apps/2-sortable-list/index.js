export default class SortableList {
  element = {};
  draggingElement = {};
  draggingShift = {
    x: 0,
    y: 0
  };
  items = [];

  constructor({items} = {}) {
    this.items = items;
    this.render();
    this.initHandlers();
  }

  render() {
    this.element = document.createElement("ul");
    this.element.className = "sortable-list";
    this.element.innerHTML = `
      ${this.items.map(item => {
      item.className = "sortable-list__item";
      return item.outerHTML;
    }).join("\n")}
    `;
  }

  placeHolderElement() {
    const placeholder = document.createElement("div");
    placeholder.innerHTML = '<li class="sortable-list__item sortable-list__placeholder"></li>';
    return placeholder.firstElementChild;
  }

  removePlaceHolder() {
    const existingPlaceholder = this.element.querySelector(".sortable-list__placeholder");
    if (existingPlaceholder) {
      existingPlaceholder.remove();
    }
  }

  putPlaceHolderAfter(element) {
    this.removePlaceHolder();
    element.after(this.placeHolderElement());
  }

  putPlaceHolderBefore(element) {
    this.removePlaceHolder();
    element.before(this.placeHolderElement());
  }

  initHandlers() {
    for (const item of this.element.querySelectorAll("[data-grab-handle]")) {
      item.addEventListener("pointerdown", this.startDragging);
      item.addEventListener("pointerup", this.stopDragging);
    }
    for (const item of this.element.querySelectorAll("[data-delete-handle]")) {
      item.addEventListener("pointerdown", this.delete);
    }
  }

  startDragging = (event) => {
    const target = event.target.closest("[data-grab-handle]");
    if (target) {
      this.draggingElement = target.parentElement;
      this.putPlaceHolderAfter(this.draggingElement);
      this.draggingElement.className = "sortable-list__item sortable-list__item_dragging";
      this.draggingShift = {
        x: event.clientX - this.draggingElement.getBoundingClientRect().left,
        y: event.clientY - this.draggingElement.getBoundingClientRect().top
      };
      document.addEventListener("pointermove", this.dragging);
      document.addEventListener("pointermove", this.shifting);
    }
  };

  dragging = (event) => {
    this.draggingElement.style.left = `${event.clientX - this.draggingShift.x}px`;
    this.draggingElement.style.top = `${event.clientY - this.draggingShift.y}px`;
  };

  shifting = () => {
    const draggingTop = this.draggingElement.getBoundingClientRect().top;
    const listItems = [...this.element.querySelectorAll("[data-grab-handle]")].map(item => item.parentElement);
    for (const item of listItems) {
      if (item.getBoundingClientRect().top < draggingTop && item.getBoundingClientRect().bottom > draggingTop) {
        this.putPlaceHolderAfter(item);
        return;
      }
    }
    const draggingBottom = this.draggingElement.getBoundingClientRect().bottom;
    for (const item of listItems) {
      if (item.getBoundingClientRect().top < draggingBottom && item.getBoundingClientRect().bottom > draggingBottom) {
        this.putPlaceHolderBefore(item);
        return;
      }
    }
  };

  stopDragging = () => {
    const placeHolder = this.element.querySelector(".sortable-list__placeholder");
    placeHolder.after(this.draggingElement);
    placeHolder.remove();
    this.draggingElement.className = "sortable-list__item";
    this.draggingElement.style.left = "";
    this.draggingElement.style.top = "";
    this.draggingElement = null;
    this.draggingShift = {x: 0, y: 0};
    document.removeEventListener("pointermove", this.dragging);
    document.removeEventListener("pointermove", this.shifting);
  };

  delete = (event) => {
    const target = event.target.closest("[data-delete-handle]");
    if (target) {
      target.removeEventListener("pointerdown", this.startDragging);
      target.removeEventListener("pointerup", this.stopDragging);
      target.removeEventListener("pointerdown", this.delete);
      target.parentElement.remove();
    }
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
    document.removeEventListener("pointermove", this.dragging);
    document.removeEventListener("pointermove", this.shifting);
  }
}
