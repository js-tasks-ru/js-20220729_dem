import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  constructor({
    data = {},
    url = "",
    range = {
      from: "",
      to: ""
    },
    label = "",
    link = "#",
    value = 0,
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;

    this.render();
  }

  render() {
    const columnChartWrapper = document.createElement('div');
    columnChartWrapper.className = `column-chart ${this.hasData() > 0 ? '' : 'column-chart_loading'}`;
    columnChartWrapper.style.cssText = `--chart-height: ${this.chartHeight}`;
    columnChartWrapper.append(this.chartTitleWrapper());
    columnChartWrapper.append(this.chartContainerWrapper());

    this.element = columnChartWrapper;
    this.subElements = this.getSubElements();
  }

  chartTitleWrapper() {
    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'column-chart__title';
    titleWrapper.innerHTML = `
        ${this.label}
        ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
    `;

    return titleWrapper;
  }

  chartContainerWrapper() {
    const containerWrapper = document.createElement('div');
    containerWrapper.className = 'column-chart__container';
    containerWrapper.append(this.chartContainerHeader());
    containerWrapper.append(this.chartContainerBody());

    return containerWrapper;
  }

  chartContainerHeader() {
    const containerHeader = document.createElement('div');
    containerHeader.className = 'column-chart__header';
    containerHeader.setAttribute('data-element', 'header');
    containerHeader.innerHTML = `${this.formatHeading(this.value)}`;

    return containerHeader;
  }

  chartContainerBody() {
    const containerBody = document.createElement('div');
    containerBody.className = 'column-chart__chart';
    containerBody.setAttribute('data-element', 'body');
    containerBody.innerHTML = this.charts();

    return containerBody;
  }

  charts() {
    if (this.hasData()) {
      return `
        ${this.dataRate()
        .map(({percent, value}) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
        .join('')}
    `;
    } else {
      return "";
    }
  }

  dataRate() {
    const resultsPerDate = Object.values(this.data);
    const max = Math.max(...resultsPerDate);
    return resultsPerDate.map(it => {
      return {
        percent: (it / max * 100).toFixed(0) + '%',
        value: String(Math.floor(it * this.chartHeight / max))
      };
    });
  }

  update(from, to) {
    this.range = {from: from, to: to};
    return fetchJson(`${BACKEND_URL}/${this.url}?${this.queryParams()}`)
      .then(data => {
        this.data = data;
        this.subElements.body.innerHTML = this.charts();
        this.element.className = `column-chart ${this.hasData() ? '' : 'column-chart_loading'}`;
        return this.data;
      });
  }

  queryParams() {
    return `from=${new Date(this.range.from).toISOString()}&to=${new Date(this.range.to).toISOString()}`;
  }

  hasData() {
    return Object.keys(this.data).length > 0;
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

  remove() {
    this.element.remove();
  }

  //todo: make a proper implementation
  destroy() {
    this.element.remove();
  }
}
