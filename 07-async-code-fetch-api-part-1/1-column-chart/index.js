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
    columnChartWrapper.className = `column-chart ${this.hasData() ? '' : 'column-chart_loading'}`;
    columnChartWrapper.style.cssText = `--chart-height: ${this.chartHeight}`;
    columnChartWrapper.innerHTML = `
    ${this.chartTitleWrapper()}
    ${this.chartContainerWrapper()}
    `;

    this.element = columnChartWrapper;
    this.subElements = this.getSubElements();
  }

  chartTitleWrapper() {
    return `
      <div class="column-chart__title">
      ${this.label}
      ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
      </div>
    `;
  }

  chartContainerWrapper() {
    return `
      <div class="column-chart__container">
      ${this.chartContainerHeader()}
      ${this.chartContainerBody()}
      </div>
    `;
  }

  chartContainerHeader() {
    return `
      <div class="column-chart__header" data-element="header">
      ${this.formatHeading(this.value)}
      </div>
    `;
  }

  chartContainerBody() {
    return `
      <div class="column-chart__chart" data-element="body">
      ${this.renderCharts()}
      </div>
    `;
  }

  renderCharts() {
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

  reRenderAsSkeleton() {
    this.element.setAttribute("class", "column-chart column-chart_loading");
  }

  reRenderAsColumnChart() {
    this.element.setAttribute("class", "column-chart");
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
    this.reRenderAsSkeleton();
    return fetchJson(this.dataRequestUrl())
      .then(data => {
        this.data = data;
        this.subElements.body.innerHTML = this.renderCharts();
        this.element.className = `column-chart ${this.hasData() ? '' : 'column-chart_loading'}`;
        this.reRenderAsColumnChart();
        return this.data;
      });
  }

  dataRequestUrl() {
    const dataRequestUrl = new URL(`${BACKEND_URL}/${this.url}`);
    dataRequestUrl.searchParams.set("from", new Date(this.range.from).toISOString());
    dataRequestUrl.searchParams.set("to", new Date(this.range.to).toISOString());
    return dataRequestUrl;
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

  destroy() {
    this.element.remove();
  }
}
