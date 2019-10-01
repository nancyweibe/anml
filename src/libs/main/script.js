let enter = null, coverAnimCont = null, intro = null, cover = null, header = null, menuToggler = null, grid = null, menu = null, content = null, next = null, loaderBar = null, isContent = false;

const segmentsCount = 6;
let coverAnim = null;
let sepText = null;
let flowImages = null;

buildGrid();
buildCover();
iefixes();
introPlay();

function init() {

  enter = document.querySelector(".enter");
  intro = document.querySelector(".intro");
  cover = document.querySelector(".cover");
  header = document.querySelector(".header");
  menuToggler = document.querySelector(".menu-toggler");
  menu = document.querySelector(".menu");
  content = document.querySelector(".content");
  next = document.querySelector(".next");
  loaderBar = document.querySelector(".hero .scroll-line");
  grid = document.querySelector(".grid");
  coverAnimCont = document.querySelector(".cover-anim");

  coverAnim = new CoverAnim(".cover-anim");
  sepText = new SepText();
  flowImages = new FlowImages(".flow-images");

  events();
  setHeader();
  entry("[data-entry]");
}

function entry(c) {
  const sections = document.querySelectorAll(c);

  check();

  document.onscroll = function () {
    check()
  };

  function check() {
    sections.forEach(function (element) {
      if (isScrolledIntoView(element)) {
        element.classList.add(element.dataset.entry);
        if (element.dataset.delay) element.classList.add(element.dataset.delay);
      }
    });
  }

}

function setHeader() {
  document.addEventListener("scroll", () => {
    header.classList.remove("black", "white");
    let theme = document.elementFromPoint(0, 50).closest("[data-theme]").dataset.theme;
    header.classList.add(theme);
  });
}

function events() {

  menuToggler.addEventListener("click", () => {
    menuToggler.classList.toggle("active");
    menu.classList.toggle("active");
    cover.classList.toggle("formenu");
    grid.classList.toggle("formenu");

    header.classList.remove("black", "white");

    if (menuToggler.classList.contains("active")) {
      header.classList.add("white");
      isContent ? cover.classList.add("z-31") : coverAnimCont.classList.add("formenu");
    } else {
      let theme = document.elementFromPoint(0, 50).closest("[data-theme]").dataset.theme;
      header.classList.add(theme);
      isContent ? setTimeout(() => { cover.classList.remove("z-31") }, 1500) : cover.classList.remove("z-31");
      coverAnimCont.classList.remove("formenu");
    }

    if (isContent) {
      if (menuToggler.classList.contains("active")) {
        //content.classList.remove("active");
        next.classList.remove("active");
      } else {
        content.classList.add("active");
        next.classList.add("active");
      }
    }
  })

  enter.addEventListener("click", () => {
    goToPage();
  });

  coverAnim.titles.forEach((elm, i) => {
    elm.querySelector("a").addEventListener("click", (e) => {
      e.target.classList.add("active");

      coverAnim.open(i);

      isContent = true;
      content.classList.add("active");
      next.classList.add("active");
    });
  });

  //enter.click();
}

function isScrolledIntoView(el) {
  var rect = el.getBoundingClientRect(), top = rect.top, height = rect.height,
    el = el.parentNode
  if (rect.bottom < 0) return false
  if (top > document.documentElement.clientHeight) { return false }
  else {
    rect = el.getBoundingClientRect()
    if (top <= rect.bottom === false) return false
    if ((top + height) <= rect.top) return false
    el = el.parentNode
  } while (el != document.body)
    return true
}

function checkIntroScroll() {

  const container = document.querySelector(".intro");
  let isMobile = false;
  let isTouched = false;
  let ts = null;

  if (container.addEventListener) {
    if ('onwheel' in document) {
      container.addEventListener("wheel", onWheel);
    } else if ('onmousewheel' in document) {
      container.addEventListener("mousewheel", onWheel);
    } else {
      container.addEventListener("MozMousePixelScroll", onWheel);
    }
  } else {
    container.attachEvent("onmousewheel", onWheel);
  }

  //window.innerWidth > 991 ? isMobile = false : isMobile = true;

  container.addEventListener("touchstart", onTouch);
  container.addEventListener("touchstop", onstopTouch);
  container.addEventListener("touchmove", onWheel);


  function onTouch(e) {
    isTouched = true;
    isMobile ? ts = e.touches[0].clientX : ts = e.touches[0].clientY;
  }

  function onstopTouch(e) {
    isTouched = false;
  }

  function onWheel(e) {
    e = e || window.event;
    let delta = null;

    isMobile ? delta = e.deltaX || e.detail || e.wheelDelta : delta = e.deltaY || e.detail || e.wheelDelta;

    if (e.type == 'touchmove') {
      let te = null;

      isMobile ? te = e.changedTouches[0].clientX : te = e.changedTouches[0].clientY;

      (ts > te) ? delta = 1 : delta = -1;
    }

    (delta > 0) ? goToPage(1) : '';

  }
}

function goToPage() {
  intro.classList.add("close");
  cover.classList.add("step-1");
  cover.classList.add("step-2");
  header.classList.add("active");
  coverAnim.play();
}

function buildCover() {
  const coverConrainer = document.createElement("div");
  const coverSegment = document.createElement("div");

  coverSegment.classList.add("cover-segment");
  coverConrainer.classList.add("cover");
  document.body.appendChild(coverConrainer);

  for (let i = 0; i < segmentsCount; i++) {
    coverConrainer.appendChild(coverSegment.cloneNode());
  }
}

function buildGrid() {
  const gridContainer = document.createElement("div");
  const gridLine = document.createElement("div");
  let segments = [];

  gridLine.classList.add("grid-line");
  gridContainer.classList.add("grid");
  document.body.appendChild(gridContainer);

  for (let i = 0; i < segmentsCount; i++) {
    segments.push(gridLine.cloneNode());
    gridContainer.appendChild(segments[i]);
  }
}

function introPlay() {
  function sel(v) { return document.querySelector(v); }
  function loadbar() {
    var ovrl = sel(".overlay"),
      prog = sel(".progress"),
      logo = sel(".intro .logo"),
      grid = sel(".grid"),
      img = document.images,
      c = 0,
      tot = img.length;

    if (tot == 0) return doneLoading();

    function imgLoaded() {
      c += 1;
      var perc = ((100 / tot * c) << 0) + "%";
      prog.style.height = perc;
      if (c === tot) return doneLoading();
    }
    function doneLoading() {

      init();

      coverAnim.show();

      setTimeout(() => {
        ovrl.classList.add("d-none");
        grid.classList.add("active");
      }, 500);
      setTimeout(() => {
        intro.classList.add("step-1");
        prog.classList.add("hide");
        setTimeout(() => {
          setTimeout(() => {
            intro.classList.add("step-2");
            sepText.play();
            setTimeout(() => {
              flowImages.show();
              checkIntroScroll();
            }, 600);
          }, 1400);
        }, 600);
      }, 1000);



    }
    for (var i = 0; i < tot; i++) {
      var tImg = new Image();
      tImg.onload = imgLoaded;
      tImg.onerror = imgLoaded;
      tImg.src = img[i].src;
    }
  }
  document.addEventListener('DOMContentLoaded', loadbar, false);
}

function iefixes() {

  HTMLElement = typeof (HTMLElement) != 'undefined' ? HTMLElement : Element;

  HTMLElement.prototype.prepend = function (element) {
    if (this.firstChild) {
      return this.insertBefore(element, this.firstChild);
    } else {
      return this.appendChild(element);
    }
  };

  NodeList.prototype.forEach = Array.prototype.forEach;

  (function (ElementProto) {
    if (typeof ElementProto.matches !== 'function') {
      ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
        var element = this;
        var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
        var index = 0;

        while (elements[index] && elements[index] !== element) {
          ++index;
        }

        return Boolean(elements[index]);
      };
    }

    if (typeof ElementProto.closest !== 'function') {
      ElementProto.closest = function closest(selector) {
        var element = this;

        while (element && element.nodeType === 1) {
          if (element.matches(selector)) {
            return element;
          }

          element = element.parentNode;
        }

        return null;
      };
    }
  })(window.Element.prototype);

  Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
  }
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
      if (this[i] && this[i].parentElement) {
        this[i].parentElement.removeChild(this[i]);
      }
    }
  }

  if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
      'use strict';
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }
}

