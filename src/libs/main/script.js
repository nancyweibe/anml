import CoverAnim from '../coveranim/coveranim';
import SepText from '../septext/septext';
import FlowImages from '../flowimages/flowimages';
import styles from '../../scss/style.scss';


let enter = null, loaded = null, folder = "./", path = "./", scrollNextCount = 0, isNav = false, hero = null, coverAnimCont = null, intro = null, cover = null, header = null, menuToggler = null, grid = null, menu = null, content = null, next = null, loaderBar = null, isContent = false;

const segmentsCount = 6;
let coverAnim = null;
let sepText = null;
let flowImages = null;
const domain = window.location.hostname;
const body = document.body.innerHTML;

buildGrid();
buildCover();
iefixes();
play();

function init() {



  const url = window.location.href;

  if (typeof isIndex == 'undefined') {
    applyTemplate(() => {
      initGlobal();
      setTimeout(() => {
        initContent();
      }, 2000)
      initEvents();
      initHeader();
      initLinks();
      openPage();
    })
  } else {
    initGlobal();
    initContent();
    initIntro();
    initCoverAnim();
    initEvents();
    initHeader();
    initLinks();
  }
}

function openPage() {

  setTimeout(() => {
    cover.classList.add("expanded");
    header.classList.add("active");
  }, 1000);

}

function applyTemplate(calback) {
  let newLoaded = document.createElement("div");
  let html = '';
  let xmlhttp = new XMLHttpRequest();

  let elements = document.querySelectorAll(".hero, .content, .next");

  elements.forEach((element) => {
    element.remove();
  });

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
      html = xmlhttp.responseText;
      html = createElementFromHTML(html);

      html.forEach((elm) => {
        document.body.prepend(elm);
      });

      newLoaded.classList.add("loaded");
      document.body.appendChild(newLoaded);
      newLoaded.innerHTML = body.replace('<script src="./assets/bundle.js"></script>', '');
      calback();
    }
  };

  xmlhttp.open("GET", "./template.html", true);
  xmlhttp.send();
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.childNodes;
}

function initGlobal() {
  header = document.querySelector(".header");
  menuToggler = document.querySelector(".menu-toggler");
  menu = document.querySelector(".menu");
  loaderBar = document.querySelector(".hero .scroll-line");
  loaded = document.querySelector(".loaded");
}

function initContent() {
  content = document.querySelector(".content");
  next = document.querySelector(".next");
  hero = document.querySelector(".hero");

  setTimeout(() => {
    hero.classList.add("active");
  }, 100);

  entry("[data-entry]");
}

function initIntro() {
  enter = document.querySelector(".enter");
  intro = document.querySelector(".intro");
  sepText = new SepText();
  flowImages = new FlowImages(".flow-images");
}

function initCoverAnim() {
  coverAnimCont = document.querySelector(".cover-anim");
  coverAnim = new CoverAnim(".cover-anim");
}

function initLinks() {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      let href = link.getAttribute("href");
      let delay = link.getAttribute("link-delay");
      let cdelay = link.getAttribute("cover-delay");

      if (!delay) delay = 0;
      if (!cdelay) cdelay = 900;

      navigate(href, delay, cdelay, e);
    });
  });
};

function navigate(href, delay, delayP = 900, e) {
  if (!isNav) {
    isNav = true;
    if (((href.indexOf('./') + 1) && href.length == 2) || ((href.indexOf('./') + 1) && href.length == domain.length)) {
      window.location = href;
      return;
    }

    if ((href.indexOf('./') + 1) || (href.indexOf(domain) + 1)) {
      if (e) e.preventDefault();

      var html = '';
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
          setTimeout(() => {
            html = xmlhttp.responseText;
            cover.classList.remove("step-1", "step-2", "expanded");

            setTimeout(() => {
              loaded.innerHTML = html;

              preloader(false, () => {
                let pageTitle = document.querySelector("#page-title").innerHTML;
                document.title = pageTitle;
                window.history.pushState({ "pageTitle": pageTitle }, "", href);

                setTimeout(() => {
                  document.body.scrollTop = document.documentElement.scrollTop = 0;
                  cover.classList.add("expanded");
                  setTimeout(() => {
                    initContent();
                    initLinks();
                    isNav = false;
                  }, 1200);
                }, 1300);
              });
            }, delayP);
          }, delay);
        }
      };

      xmlhttp.open("GET", href, true);
      xmlhttp.send();
    }
  }
}

function entry(c) {
  const sections = document.querySelectorAll(c);

  check();

  document.onscroll = function () {
    check();
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

function initHeader() {
  let theme = "white";

  document.addEventListener("scroll", () => {
    header.classList.remove("black", "white");
    let container = document.elementFromPoint(0, 50).closest("[data-theme]");
    if (container) theme = container.dataset.theme;

    header.classList.add(theme);
  });
}

function initEvents() {

  const menuLinks = menu.querySelectorAll("a");

  menuToggler.addEventListener("click", () => {
    menuToggler.classList.toggle("active");
    menu.classList.toggle("active");
    header.classList.remove("black", "white");

    if (menuToggler.classList.contains("active")) {
      cover.classList.add("formenu");
      grid.classList.add("formenu");
      header.classList.add("white");
      isContent ? cover.classList.add("z-31") : coverAnimCont ? coverAnimCont.classList.add("formenu") : '';
    } else {
      setTimeout(() => {
        cover.classList.remove("formenu");
        grid.classList.remove("formenu");
        let theme = document.elementFromPoint(0, 50).closest("[data-theme]").dataset.theme;
        header.classList.add(theme);
        isContent ? setTimeout(() => { cover.classList.remove("z-31") }, 1500) : cover.classList.remove("z-31");
        if (coverAnimCont) coverAnimCont.classList.remove("formenu");
      }, 1600);
    }

    if (isContent) {
      if (menuToggler.classList.contains("active")) {
      } else {
        content.classList.add("active");
      }
    }
  })

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggler.classList.remove("active");
      menu.classList.remove("active");
      cover.classList.remove("formenu");
      grid.classList.remove("formenu");
      cover.classList.remove("z-31")
      if (coverAnimCont) coverAnimCont.classList.remove("formenu");
    });
  });

  if (document.addEventListener) {
    if ('onwheel' in document) {
      document.addEventListener("wheel", onWheel);
    } else if ('onmousewheel' in document) {
      document.addEventListener("mousewheel", onWheel);
    } else {
      document.addEventListener("MozMousePixelScroll", onWheel);
    }
  } else {
    document.attachEvent("onmousewheel", onWheel);
  }

  document.addEventListener("touchmove", onWheel);

  function onWheel() {
    if (next) {
      const href = next.dataset.target;
      var rect = next.getBoundingClientRect();
      if (rect.top < 1) {
        if (scrollNextCount > 2) {
          navigate(href, 0, 1700, null);
          scrollNextCount = 0;
        }
        scrollNextCount++;
      }
    }
  }

  if (coverAnim) {
    enter.addEventListener("click", () => {
      goToPage();
    });

    coverAnim.titles.forEach((elm, i) => {
      elm.querySelector("a").addEventListener("click", (e) => {
        e.target.classList.add("active");

        coverAnim.open(i);

        isContent = true;
      });
    });

    //enter.click();
  }
}

function isScrolledIntoView(el) {
  let top = el.offsetTop + 100;
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

function checkIntroScroll() {

  const container = document.querySelector(".intro");
  if (container) {
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

  cover = document.querySelector(".cover");
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

  grid = document.querySelector(".grid");
}

function preloader(isFirst = false, calback) {

  if (!isFirst) {
    cover.classList.remove("step-1", "step-2", "expanded");
    loadbar();
  }

  function loadbar() {
    var prog = document.createElement('div'),
      img = document.images,
      c = 0,
      tot = img.length;

    prog.classList.add("progress");
    document.body.appendChild(prog);

    if (tot == 0) {
      imitate(0);
    }

    function imitate(i) {
      if (i < 11) {
        setTimeout(() => {
          imitate(i + 1);
          prog.style.height = i * 10 + "%";
        }, 50);
      } else {
        return doneLoading();
      }
    }

    function imgLoaded() {
      c += 1;
      var perc = ((100 / tot * c) << 0) + "%";
      prog.style.height = perc;
      if (c === tot) return doneLoading();
    }
    function doneLoading() {
      setTimeout(() => {
        prog.classList.add("hide");
        calback();
        setTimeout(() => {
          prog.remove();
        }, 1000);
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

function play() {
  const ovrl = document.querySelector(".overlay");

  preloader(true, () => {
    init();

    if (coverAnim) {
      coverAnim.show();

      setTimeout(() => {
        ovrl.classList.add("d-none");
        grid.classList.add("active");
      }, 500);
      setTimeout(() => {
        intro.classList.add("step-1");
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
    } else {
      setTimeout(() => {
        grid.classList.add("active", "x5");
      }, 500);
    }
  });
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
  HTMLCollection.prototype.forEach = Array.prototype.forEach;

  HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

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

