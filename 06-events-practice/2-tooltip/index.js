class Tooltip {
  static instance;
  static deltaX = 10;
  static deltaY = 10;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }
    return Tooltip.instance;
  }

  initialize() {
    document.addEventListener('pointerover', this.pointerOver);
    document.addEventListener('pointermove', this.pointerMove);
    document.addEventListener('pointerout', this.pointerOut);
  }

  pointerOver = function (event) {
    if (event.target.dataset.tooltip) {
      console.log(`point over ${event.target.textContent}`);
      console.log(`point over ${event.target.dataset?.tooltip}`);
      Tooltip.instance.tooltipText = event.target.dataset.tooltip;
      Tooltip.instance.render(event.clientX, event.clientY);
    }
  };

  pointerMove = function (event) {
    if (event.target.dataset.tooltip) {
      Tooltip.instance.element.style.left = `${event.clientX + Tooltip.deltaX}px`;
      Tooltip.instance.element.style.top = `${event.clientY + Tooltip.deltaY}px`;
    }
  };

  pointerOut = function (event) {
    if (event.target.dataset.tooltip) {
      Tooltip.instance.destroy();
    }
  };

  render(x = 0, y = 0) {
    console.log('render');
    this.element = document.createElement("div");
    this.element.className = "tooltip";
    this.element.textContent = this.tooltipText;
    this.element.style.position = "absolute";
    this.element.style.left = `${x + Tooltip.deltaX}px`;
    this.element.style.top = `${y + Tooltip.deltaY}px`;
    document.body.append(this.element);
  }

  destroy() {
    if (this.element) {
      this.element.removeEventListener('pointerover', this.pointerOver);
      this.element.removeEventListener('pointermove', this.pointerMove);
      this.element.removeEventListener('pointerout', this.pointerOut);
      this.element.remove();
      this.element = null;
    }
  }
}

export default Tooltip;
