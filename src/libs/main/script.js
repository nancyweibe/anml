import { iefixes, scrollTo, getPosition, serialize } from './utils.js';
import CoverAnim from '../coveranim/coveranim';
import SepText from '../septext/septext';
import FlowImages from '../flowimages/flowimages';
import MaskCarousel from '../maskcarousel/MaskCarousel';
import Odometer from '../odometer/Odometer';
import Parralax from '../parralax/Parralax';
import styles from '../../scss/style.scss';
import '../tinyslider/tiny-slider.scss';
import { tns } from "../tinyslider/tiny-slider";
import InfiniteScroll from "../infinitescroll/infinitescroll";
import MaskScroll from "../maskscroll/maskscroll";


let enter = null, isEntered = false, MaskScrollClass=null, cursor = null, loaded = null, isLoadbar = true, scrollNextCount = 0, isNav = false, hero = null, coverAnimCont = null, intro = null, cover = null, header = null, menuToggler = null, grid = null, menu = null, content = null, next = null, loaderBar = null, isContent = false;

document.body.style.cursor = "url('./assets/img/cursor.svg') 3 3, auto";

const segmentsCount = 6;
let coverAnim = null;
let sepText = null;
let flowImages = null;
const domain = window.location.hostname;
const body = document.body.innerHTML;
let isIntro = true;

buildGrid();
buildCover();
iefixes();
play();

function init() {

  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  if (typeof isIndex == 'undefined') {

    isIntro = false;

    applyTemplate(() => {
      initGlobal();
      setTimeout(() => {
        initBeforeContent();
      }, 1000)
      setTimeout(() => {
        initContent();
      }, 2000)
      clearCover();
      initEvents();
      initHeader();
      initLinks();
      openPage();
      initSpecialLinks();
    })
  } else {
    initGlobal();
    initBeforeContent();
    initContent();
    initIntro();
    initCoverAnim();
    initEvents();
    initHeader();
    initLinks();
    initSpecialLinks();
  }

}

function customCursor() {

  if (cursor) cursor.remove();

  cursor = document.createElement("div");
  cursor.classList.add("cursor");

  document.documentElement.appendChild(cursor);

  const updateProperties = (elem, state) => {

    elem.style.setProperty('--x', `${state.x}px`)
    elem.style.setProperty('--y', `${state.y}px`)
    elem.style.setProperty('--width', `${state.width}px`)
    elem.style.setProperty('--height', `${state.height}px`)
    elem.style.setProperty('--radius', state.radius)
    elem.style.setProperty('--scale', state.scale)

  }

  document.querySelectorAll('.cursor').forEach((cursor) => {

    let onElement

    const createState = (e) => {

      const defaultState = {
        x: e.clientX,
        y: e.clientY,
        width: 42,
        height: 42,
        radius: '100px'
      }

      const computedState = {}

      if (onElement != null) {
        let top, left, width, height, radius;

        if (onElement != "resize") {
          top = onElement.getBoundingClientRect().top
          left = onElement.getBoundingClientRect().left
          width = onElement.getBoundingClientRect().width
          height = onElement.getBoundingClientRect().height
          radius = window.getComputedStyle(onElement).borderTopLeftRadius
        } else {
          top = e.clientY - defaultState.width * 1.4 / 2
          left = e.clientX - defaultState.height * 1.4 / 2
          width = defaultState.width * 1.4;
          height = defaultState.height * 1.4;
          radius = "50%";
        }

        computedState.x = left + width / 2
        computedState.y = top + height / 2
        computedState.width = width
        computedState.height = height
        computedState.radius = radius
      }

      return {
        ...defaultState,
        ...computedState
      }

    }

    document.addEventListener('mousemove', (e) => {
      const state = createState(e)
      updateProperties(cursor, state)
    })

    document.querySelectorAll('[data-cursor]').forEach((elem) => {
      elem.addEventListener('mouseenter', () => onElement = elem)
      elem.addEventListener('mouseleave', () => onElement = undefined)
    })

    document.querySelectorAll('a, [data-cursorh]').forEach((elem) => {
      elem.addEventListener('mouseenter', () => onElement = "resize")
      elem.addEventListener('mouseleave', () => onElement = undefined)
    })

  })
}

function clearCover() {
  cover.classList.remove("step-1", "step-2");
}

function initBeforeContent() {
  hero = document.querySelector(".hero");

  if (hero) {
    setTimeout(() => {
      hero.classList.add("active");
    }, 600);
  }
}

// function initLockedViews() {
//   let scroled = false;
//   let views = document.querySelectorAll(".locked-view");

//   views.forEach((view) => {

//     view.addEventListener("mouseover", (e) => {
//       var top = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
//       if (!scroled) {
//         if (Math.abs(top - getPosition(view).y) > 2) {
//           scrollTo(getPosition(view).y, 1000);
//           scroled = true;
//         }
//       }
//     });

//     view.addEventListener("mouseleave", (e) => {
//       setTimeout(() => {
//         scroled = false;
//       }, 2000)
//     });


//   });
// }

function initSpecialLinks() {
  let links = document.querySelectorAll(".link-special");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      //e.preventDefault();
      clearSpecialLinks();
      link.classList.toggle("active");
    });
  });
}

function clearSpecialLinks() {
  let links = document.querySelectorAll(".link-special");
  links.forEach((link) => {
    link.classList.remove("active");
  });
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

  let elements = document.querySelectorAll(".hero, .content, .next, .mask-scroll");

  elements.forEach((element) => {
    if (element) element.remove();
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

      let title = document.querySelector("#page-title");
      document.title = title.innerHTML;

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

  entry("[data-entry]");
  //initLockedViews();
  initCarousels();
  initMaskCarousels();
  initOdometer();
  initInfiniteScroll();
  initParralax();
  gridToBackWard();
  initArrowLinks();
  initMaskScroll();
  simpleGrid();
  forms();
  customCursor();
}

function initMaskScroll() {
  let maskScroll = document.querySelector(".mask-scroll");

  if (MaskScrollClass) MaskScrollClass.destroy();


  if (maskScroll) {
    MaskScrollClass = new MaskScroll(maskScroll, {}, (data) => {
      data.dataset.grid ? addClassToGrid(data.dataset.grid) : clearGrid("to-backward");
      setHeaderTheme();
    });
  }
}

function setHeaderTheme() {
  cursor.classList.remove("black", "white");
  header.classList.remove("black", "white");
  let theme = document.elementFromPoint(0, 50).closest("[data-theme]").dataset.theme;
  header.classList.add(theme);
  cursor.classList.add(theme);

  theme == "black" ? document.body.style.cursor = "url('./assets/img/cursor-black.svg') 3 3, auto" : document.body.style.cursor = "url('./assets/img/cursor.svg') 3 3, auto";
}

function initArrowLinks() {
  let links = document.querySelectorAll(".pressets-logos a");

  links.forEach((link) => {
    let icon = document.createElement("i");
    icon.classList.add("icon-arrow-small");
    if (link.getAttribute("href")) link.appendChild(icon);
  });
}

function gridToBackWard() {
  if (!isIntro) {
    setTimeout(() => {
      if (typeof disableToBackward == "undefined") {
        addClassToGrid("to-backward");
      }
    }, 600);
  }
}

function initInfiniteScroll() {
  let infiniteScrolls = document.querySelectorAll(".infinite-scroll");

  if (infiniteScrolls) {

    // infiniteScrolls.forEach((infiniteScroll) => {
    //   let slider = tns({
    //     container: infiniteScroll,
    //     items: 3,
    //     center:true,
    //     preventScrollOnTouch: "force",
    //     controls:false,
    //     nav:false,
    //     loop: true,
    //     axis: "vertical",
    //     autoplay: false,
    //     autoplayButtonOutput: false,
    //     mouseDrag: true,
    //   });
    // });



    infiniteScrolls.forEach((infiniteScroll) => {
      new InfiniteScroll(infiniteScroll, {}, ()=>{
        initLinks();
      });
    });
  }
}

function initOdometer() {
  let odometers = document.querySelectorAll("[odometer]");
  if (odometers) {
    odometers.forEach((odometer) => {
      new Odometer(odometer);
    });
  }
}

function initParralax() {
  let parralaxs = document.querySelectorAll("[parralax]");
  if (parralaxs) {
    parralaxs.forEach((parralax) => {
      new Parralax(parralax);
    });
  }
}

function initMaskCarousels() {
  if (document.querySelector(".mask-carousel")) {
    let maskCarousel = new MaskCarousel(".mask-carousel", {
      autoplay: false,
      controlsContainer: 1,
      controls: ["<i class='icon-arrow-left'></i>", "<i class='icon-arrow-right'></i>"]
    });
  }
}

function initCarousels() {
  let carousels = document.querySelectorAll(".block-carousel-items");

  carousels.forEach((carousel) => {
    var slider = tns({
      container: carousel,
      items: 1,
      slideBy: 'page',
      autoplay: true,
      autoplayButtonOutput: false,
      controlsPosition: "bottom",
      navPosition: "bottom",
      mouseDrag: true,
      controlsText: ["<i class='icon-arrow-left'></i>", "<i class='icon-arrow-right'></i>"]
    });


  });

}

function initIntro() {
  enter = document.querySelector(".enter");
  intro = document.querySelector(".intro");
  sepText = new SepText();
  flowImages = new FlowImages(".flow-images");
  document.body.classList.add("disable-scroll");
  disableScroll(intro);
}

function initCoverAnim() {
  coverAnimCont = document.querySelector(".cover-anim");
  coverAnim = new CoverAnim(".cover-anim");
}

function initLinks() {
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      //e.preventDefault();
      let href = link.getAttribute("href");
      let delay = link.getAttribute("link-delay");
      let cdelay = link.getAttribute("cover-delay");

      link.classList.add("active");

      setTimeout(() => {
        link.classList.remove("active");
      }, 2000)

      if (!delay) delay = 0;
      if (!cdelay) cdelay = 650;

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
            cover.classList.remove("step-1", "step-2", "expanded", "hide-left");

            clearGrid("to-backward");

            setTimeout(() => {
              loaded.innerHTML = html;

              preloader(false, () => {
                let pageTitle = document.querySelector("#page-title").innerHTML;
                document.title = pageTitle;
                window.history.pushState({ "pageTitle": pageTitle }, "", href);

                setTimeout(() => {
                  document.body.scrollTop = document.documentElement.scrollTop = 0;
                  cover.classList.add("expanded");

                  initBeforeContent();

                  setTimeout(() => {
                    initContent();
                    initLinks();
                    //initLockedViews();
                    clearSpecialLinks();
                    isNav = false;
                  }, 1200);
                }, 0); // 1300 for preloader
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
    if (cursor) cursor.classList.remove("black", "white");
    header.classList.remove("black", "white");
    let container = document.elementFromPoint(0, 50).closest("[data-theme]");
    if (container) theme = container.dataset.theme;

    header.classList.add(theme);
    if(cursor) cursor.classList.add(theme);

    theme == "black" ? document.body.style.cursor = "url('./assets/img/cursor-black.svg') 3 3, auto" : document.body.style.cursor = "url('./assets/img/cursor.svg') 3 3, auto";
  });
}

function forms() {

  NodeList.prototype.map = Array.prototype.map;
  var inputs = document.querySelectorAll("input, textarea");

  inputs.map(function (elm) {
    elm.addEventListener("change", function (e) {
      if (elm.value.length > 0) {
        elm.dataset.empty = false;
      } else {
        elm.dataset.empty = true;
      }
    });
  });

  var forms = document.querySelectorAll("form");

  forms.map(function (elm) {
    elm.addEventListener("submit", function (e) {
      e.preventDefault();

      let form = e.target;
      let action = form.getAttribute("action");
      let xhttp = new XMLHttpRequest();

      xhttp.open("POST", action, true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(serialize(elm));

      xhttp.onreadystatechange = function (data) {
        if (xhttp.status == 200 && xhttp.readyState == 4) {
          if (data.target.responseText == "1") {
            elm.classList.add("succes");
          } else {
            elm.classList.add("error");
          }
        } else {
          elm.classList.add("error");
        }
      }
    });
  });

}

function initEvents() {

  menuEvents();
  scrollEvents();
  coverEvents();
  globalEvents();

}


function globalEvents(){
  window.addEventListener("resize", ()=>{
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
}

function coverEvents() {
  if (coverAnim) {
    enter.addEventListener("click", () => {
      goToPage();
    });

    coverAnim.titles.forEach((elm, i) => {
      elm.querySelector("a").addEventListener("click", (e) => {
        coverAnim.open(i);
        isContent = true;
      });
    });
    //enter.click();
  }
}

function scrollEvents() {
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
    if (next && !next.classList.contains('disabled')) {
      const href = next.dataset.target;
      var rect = next.getBoundingClientRect();
      if (rect.top < 1) {
        if (scrollNextCount > 2) {
          navigate(href, 0, 650, null);
          scrollNextCount = 0;
        }
        scrollNextCount++;
      }
    }
  }
}

function menuEvents() {
  const menuLinks = menu.querySelectorAll("a");

  menuToggler.addEventListener("click", () => {
    menuToggler.classList.toggle("active");
    menu.classList.toggle("active");
    header.classList.remove("black", "white");
    document.body.classList.add("disable-scroll");

    if (menuToggler.classList.contains("active")) {
      cover.classList.add("formenu");
      addClassToGrid("formenu");
      //loaderBar.classList.add("formenu");
      header.classList.add("white");
      isContent ? cover.classList.add("z-31") : coverAnimCont ? coverAnimCont.classList.add("formenu") : '';
    } else {
      document.body.classList.remove("disable-scroll");
      menu.classList.add("hide");
      setTimeout(() => {
        menu.classList.remove("hide");
        cover.classList.remove("formenu");

        clearGrid("formenu");

        loaderBar.classList.add("formenu");

        let theme = document.elementFromPoint(0, 50).closest("[data-theme]").dataset.theme;
        header.classList.add(theme);

        isContent ? setTimeout(() => { cover.classList.remove("z-31") }, 1500) : cover.classList.remove("z-31");
        if (coverAnimCont) coverAnimCont.classList.remove("formenu");
      }, 600);
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
      menu.classList.add("hide");
      menu.classList.remove("active");
      document.body.classList.remove("disable-scroll");
      cover.classList.remove("formenu");
      grid.classList.remove("formenu");
      cover.classList.remove("z-31");

      setTimeout(() => {
        menu.classList.remove("hide");
      }, 600)

      if (coverAnimCont) coverAnimCont.classList.remove("formenu");
    });
  });
}

function addClassToGrid(className) {
  let grids = document.querySelectorAll(".grid");
  grids.forEach((gridE) => {
    gridE.classList.add(className);
  });
}

function clearGrid(className) {
  let grids = document.querySelectorAll(".grid");
  grids.forEach((gridE) => {
    gridE.classList.remove(className);
  });
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
  isEntered = true;
  intro.classList.add("close");
  cover.classList.add("step-1");
  cover.classList.add("step-2");
  header.classList.add("active");
  coverAnim.play();
  isIntro = false;

  setTimeout(()=>{
    document.body.classList.remove("disable-scroll");
    if (coverAnim) coverAnim.states.isScroll = false;
    if (coverAnim) coverAnim.states.isdisablesScroll = false;
  }, 1400);
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

function simpleGrid() {
  if (document.querySelector(".simple-grid")) {

    let grids = document.querySelectorAll(".simple-grid");

    grids.forEach((gridC) => {
      const gridContainer = document.createElement("div");
      const gridLine = document.createElement("div");
      let segments = [];

      gridLine.classList.add("grid-line");
      gridContainer.classList.add("grid");
      gridC.appendChild(gridContainer);

      for (let i = 0; i < segmentsCount; i++) {
        segments.push(gridLine.cloneNode());
        gridContainer.appendChild(segments[i]);
      }

      grid = document.querySelector(".grid");
    });

  }
}

function preloader(isFirst = false, calback) {

  let delay = 1000;

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

    if (isLoadbar) {
      document.body.appendChild(prog);
      setTimeout(() => {
        if (prog) prog.remove();
      }, 2000);
    } else {
      delay = 0;
    }

    isLoadbar = false;

    if (tot == 0) {
      imitate(0);
    }

    function imitate(i) {
      if (i < 11) {
        setTimeout(() => {
          imitate(i + 1);
          prog.style.height = i * 10 + "%";
        }, 0); // 50 for imitate
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
      }, delay);
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

function disableScroll(container) {
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
  container.addEventListener("touchmove", onWheel);

  function onWheel(e){
    e.preventDefault();
  }


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
              setTimeout(() => {
                if (!isEntered) {
                  enter.click();
                }
              }, 10000)
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