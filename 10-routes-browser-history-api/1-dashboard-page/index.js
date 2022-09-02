import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

export default class Page {
  element;
  subElements;
  charts = [];

  constructor() {
  }

  getTemplate() {
    return `
    <div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Dashboard</h2>
        <!-- RangePicker component -->
        <div data-element="rangePicker"></div>
      </div>
      <div data-element="chartsRoot" class="dashboard__charts">
        <!-- column-chart components -->
        <div data-element="ordersChart" class="dashboard__chart_orders"></div>
        <div data-element="salesChart" class="dashboard__chart_sales"></div>
        <div data-element="customersChart" class="dashboard__chart_customers"></div>
      </div>

      <h3 class="block-title">Best sellers</h3>

      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>
    `;
  }

  async render() {
    const rangePicker = new RangePicker();
    const [
      sortableTable,
      columnChartOrders,
      columnChartSales,
      columnChartCustomers
    ] = await Promise.all([
      new SortableTable(
        header,
        {
          url: "api/dashboard/bestsellers",
          isSortLocally: true
        }
      ),
      new ColumnChart({
        url: "api/dashboard/orders",
        range: rangePicker.selected
      }),
      new ColumnChart({
        url: "api/dashboard/sales",
        range: rangePicker.selected
      }),
      new ColumnChart({
        url: "api/dashboard/customers",
        range: rangePicker.selected
      })]
    );
    this.charts = [columnChartOrders, columnChartSales, columnChartCustomers];
    const pageWrapper = document.createElement("div");
    pageWrapper.innerHTML = this.getTemplate();
    this.element = pageWrapper.firstElementChild;
    this.subElements = this.getSubElements();
    this.subElements.rangePicker.append(rangePicker.element);
    this.subElements.sortableTable.append(sortableTable.element);
    this.subElements.ordersChart.append(columnChartOrders.element);
    this.subElements.salesChart.append(columnChartSales.element);
    this.subElements.customersChart.append(columnChartCustomers.element);
    this.initEventListeners();

    return this.element;
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

  initEventListeners() {
    this.subElements.rangePicker.addEventListener("date-select", (event) => this.updatePage(event.detail));
  }

  updatePage(range) {
    this.charts.forEach(chart => chart.loadData(range.from, range.to));
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
  }
}
