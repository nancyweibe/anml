export default class InfiniteScroll {
  constructor(element, options, onChanged) {
    this.container = this.element = typeof element == "string" ? document.querySelector(element) : element;
    this.totalHeight = 0;
    this.elementHeight = 0;
    this.items = [];
    this.options = { offset: 100 }
    this.body = document.body;
    this.isPause = false;
    this.i = 0;
    this.keys = { 37: 1, 38: 1, 39: 1, 40: 1 }
    this.onChanged = onChanged;
    if (this.container) this.init();
  }

  init() {

    this.totalHeight = this.container.offsetHeight;
    this.elementHeight = this.container.querySelector(".infinite-scroll-item").offsetHeight;

    this.buildList();

    document.addEventListener("scroll", (e) => {
      let elements = this.container.querySelectorAll(".infinite-scroll-item");

      elements.forEach((element) => {
        if(this.isScrolledIntoView(element, (window.innerHeight-this.elementHeight))) {
          elements.forEach((elm) => {
            if(elm != element) elm.classList.remove("active")
          })
          element.classList.add("active");
        }
      });

      if (!this.isPause) {
        if (window.pageYOffset > (this.totalHeight - window.innerHeight - this.options.offset)) {
          this.totalHeight = this.container.offsetHeight;
          this.container.appendChild(this.items[this.i].cloneNode(true));
          this.i++;

          this.buildList();
        }
      }
    });
  }

  buildList = () => {
    let elements = this.container.querySelectorAll(".infinite-scroll-item");
    this.items = [];
    elements.forEach((element) => {
      this.items.push(element);
    });
    this.onChanged();
  }

  isScrolledIntoView = (el, offset) => {
    let top = el.offsetTop + offset;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    );
  }
}