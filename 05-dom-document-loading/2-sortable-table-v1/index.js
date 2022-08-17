export default class SortableTable {
  subElements = {};
  collator = new Intl.Collator(['ru', 'en'], {sensitivity: 'variant', caseFirst: 'upper'});

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get template() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(({id, title, sortable, template}) => {
      if (template) {
        return template(this.data);
      } else {
        return this.cellTemplate(id, sortable, title);
      }
    }).join('\n')}
    </div>

    <div data-element="body" class="sortable-table__body">
      ${this.bodyTemplate}
    </div>
    `;
  }

  cellTemplate(id, sortable, title) {
    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
      <span>${title}</span>
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    </div>
    `;
  }

  get bodyTemplate() {
    return `
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
    `;
  }

  render() {
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "sortable-table";
    tableWrapper.innerHTML = this.template;

    this.element = tableWrapper;
    this.subElements = this.getSubElements();
  }

  sort(fieldValue, orderValue) {
    for (const headerCell of this.subElements.header.children) {
      if (headerCell.dataset.id === fieldValue) {
        headerCell.dataset.order = orderValue;
      } else {
        headerCell.dataset.order = "";
      }
    }

    const sortType = this.headerConfig.find(it => it.id === fieldValue).sortType;
    const rule = (x, y) => {
      switch (sortType) {
      case "number":
        return orderValue === "asc" ? x[fieldValue] - y[fieldValue] : y[fieldValue] - x[fieldValue];
      case "string":
        return orderValue === "asc" ?
          this.collator.compare(x[fieldValue], y[fieldValue]) :
          this.collator.compare(y[fieldValue], x[fieldValue]);
      }
    };
    this.data.sort(rule);

    this.subElements.body.innerHTML = this.bodyTemplate;
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

