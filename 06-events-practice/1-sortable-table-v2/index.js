export default class SortableTable {
  subElements = {};
  collator = new Intl.Collator(['ru', 'en'], {sensitivity: 'variant', caseFirst: 'upper'});

  constructor(
    headerConfig,
    {
      data = [],
      sorted = {}
    } = {}) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;

    this.sortData();
    this.render();
    this.addEventListeners();
  }

  get template() {
    return this.headerTemplate + this.bodyTemplate;
  }

  get headerTemplate() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(({id, title, sortable, template}) => {
      if (template) {
        return template(this.data);
      } else {
        return this.headerCellTemplate(id, sortable, title);
      }
    }).join('\n')}
    </div>
    `;
  }

  headerCellTemplate(id, sortable, title) {
    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"
    ${this.sorted?.id === id ? `data-order=${this.sorted.order}` : ""}>
      <span>${title}</span>
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    </div>
    `;
  }

  get bodyTemplate() {
    return `
    <div data-element="body" class="sortable-table__body">
      ${this.data.map(({id, title, quantity, images, price, sales}) => {
        return `
          <a href="/products/${id}" class="sortable-table__row">
            ${images ? `
              <div class="sortable-table__cell">
                <img class="sortable-table-image" alt="Image" src="${images[0].url}">
              </div>
            ` : ""}
            ${title ? `<div class="sortable-table__cell">${title}</div>` : ''}

            ${quantity ? `<div class="sortable-table__cell">${quantity}</div>` : ''}
            ${price ? `<div class="sortable-table__cell">${price}</div>` : ''}
            ${sales ? `<div class="sortable-table__cell">${sales}</div>` : ''}
          </a>
        `;
      }).join('\n')}
    </div>
    `;
  }

  render() {
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "sortable-table";
    tableWrapper.innerHTML = this.template;

    this.element = tableWrapper;
    this.subElements = this.getSubElements();
  }

  addEventListeners() {
    for (const headerCell of this.subElements.header.children) {
      if (headerCell.dataset.sortable) {
        headerCell.addEventListener('pointerdown', this.sortTable.bind(this));
      }
    }
  }

  sortTable(event) {
    const sortId = event.currentTarget.dataset.id;
    this.toggleSort(sortId);
    this.sortData();
    for (const headerCell of this.subElements.header.children) {
      if (headerCell.dataset.id === this.sorted.id) {
        headerCell.dataset.order = this.sorted.order;
      } else {
        headerCell.dataset.order = "";
      }
    }
    this.subElements.body.innerHTML = this.bodyTemplate;
  }

  toggleSort(id) {
    if (id && this.sorted?.id !== id) {
      this.sorted.id = id;
      this.sorted.order = 'asc';
    } else {
      this.sorted.order = this.sorted.order === 'asc' ? 'desc' : 'asc';
    }
  }

  sortData() {
    if (!(this.sorted && this.sorted.id && this.sorted.order)) {
      return;
    }

    const sortType = this.headerConfig.find(it => it.id === this.sorted.id).sortType;
    const rule = (x, y) => {
      switch (sortType) {
      case "number":
        return this.sorted.order === "asc" ?
          x[this.sorted.id] - y[this.sorted.id] :
          y[this.sorted.id] - x[this.sorted.id];
      case "string":
        return this.sorted.order === "asc" ?
          this.collator.compare(x[this.sorted.id], y[this.sorted.id]) :
          this.collator.compare(y[this.sorted.id], x[this.sorted.id]);
      }
    };
    this.data.sort(rule);
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }

    this.element = null;
    this.subElements = {};
  }
}
