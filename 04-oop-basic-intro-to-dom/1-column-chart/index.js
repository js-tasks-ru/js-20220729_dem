export default class ColumnChart {
  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;

    this.render();
  }

  render() {
    const columnChartWrapper = document.createElement('div');
    columnChartWrapper.className = `column-chart ${this.data.length > 0 ? '' : 'column-chart_loading'}`;
    columnChartWrapper.style.cssText = `--chart-height: ${this.chartHeight}`;
    columnChartWrapper.append(this.chartTitleWrapper());
    columnChartWrapper.append(this.chartContainerWrapper());

    this.element = columnChartWrapper;
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
    if (this.data.length > 0) {
      containerBody.innerHTML = `
        ${this.dataRate()
        .map(({percent, value}) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
        .join('')}
    `;
    }

    return containerBody;
  }

  dataRate() {
    const max = Math.max(...this.data);
    return this.data.map(it => {
      return {
        percent: (it / max * 100).toFixed(0) + '%',
        value: String(Math.floor(it * this.chartHeight / max))
      };
    });
  }

  update(data) {
    this.data = data;
    const chartToRemove = this.element.querySelector('.column-chart__chart');
    const chartParent = chartToRemove.parentElement;
    chartToRemove.remove();
    chartParent.append(this.chartContainerBody());

    this.element.className = `column-chart ${this.data.length > 0 ? '' : 'column-chart_loading'}`;
  }

  remove() {
    this.element.remove();
  }

  //todo: make a proper implementation
  destroy() {
    this.element.remove();
  }
}
