export default class CoverAnim {
  constructor(selector, options) {
    this.options = { segments: window.innerWidth > 767 ? 6 : 4, slideDelay: 20000 };
    this.states = { currentSlide: 0, ts: null, isTouched: false, isScroll: true, length: 0, direction: 1, isPaused: false, isMobile: false, isdisablesScroll: false };
    this.bgsContainers = [];
    this.progressSegments = [];
    this.titles = [];
    this.container = document.querySelector(selector);
    this.cover = null;
    this.intro = null;
    if (this.container) this.init();
  }

  init() {
    this.cover = document.querySelector(".cover");
    this.intro = document.querySelector(".intro");

    this.buildBgs();
    this.buildBar();
    this.parseTitles();
    this.scrollEvents();
    this.buttonsEvents();
  }

  buttonsEvents = () => {

  }

  open(i) {

    this.states.isPaused = true;
    this.states.isScroll = true;

    setTimeout(() => {
      this.titles.forEach((elm) => {
        elm.classList.remove("active");
      });

      this.container.classList.add("expanded");
    }, 600)

  }

  scrollEvents() {
    if (this.container.addEventListener) {
      if ('onwheel' in document) {
        this.container.addEventListener("wheel", this.onWheel);
      } else if ('onmousewheel' in document) {
        this.container.addEventListener("mousewheel", this.onWheel);
      } else {
        this.container.addEventListener("MozMousePixelScroll", this.onWheel);
      }
    } else {
      this.container.attachEvent("onmousewheel", this.onWheel);
    }

    window.innerWidth > 991 ? this.states.isMobile = false : this.states.isMobile = true;

    this.container.addEventListener("touchstart", this.onTouch);
    this.container.addEventListener("touchstop", this.onstopTouch);
    this.container.addEventListener("touchmove", this.onWheel);

    // this.container.addEventListener("mousedown", this.onTouch);
    // this.container.addEventListener("mouseup", this.onstopTouch);
    // this.container.addEventListener("mousemove", this.onWheel);

  }

  onTouch = (e) => {
    this.states.isTouched = true;
    if (e.type == 'touchstart') {
      this.states.isMobile ? this.states.ts = e.touches[0].clientX : this.states.ts = e.touches[0].clientY;
    }
    if (e.type == 'mousedown') {
      this.states.ts = e.clientX;
    }
  }

  onstopTouch = (e) => {
    this.states.isTouched = false;
  }

  onWheel = (e) => {
    if(!this.states.isdisablesScroll) {
      e = e || window.event;
      //e.preventDefault(); 
      this.states.isPaused = true;
      let delta = null;
  
      this.states.isMobile ? delta = e.deltaY || e.detail || e.wheelDelta : delta = e.deltaY || e.detail || e.wheelDelta;
  
      if (e.type == 'touchmove') {
        let te = null;
  
        this.states.isMobile ? te = e.changedTouches[0].clientX : te = e.changedTouches[0].clientY;
  
        (this.states.ts > te) ? delta = 1 : delta = -1;
  
      }
  
      // if (e.type == 'mousemove') {
      //   if(this.states.isTouched) {
      //     let te = null;
      //     this.states.isMobile ? te = e.clientX : te = e.clientX;
      //     console.log("move");
      //     (this.states.ts > te) ? delta = 1 : delta = -1;
  
      //     (delta > 0) ? this.move(1) : this.move(-1);
      //   }
      // }
  
      (delta > 0) ? this.move(1) : this.move(-1);
    }
  }

  parseTitles = () => {
    this.titles = this.container.querySelectorAll(".cover-anim-titles .cover-anim-title");
  }

  move = (direction) => {
    if (!this.states.isScroll) {
      this.states.isScroll = true;
      setTimeout(() => {
        this.states.isScroll = false;
        setTimeout(() => {
          this.states.isPaused = false;
        }, this.options.slideDelay)
      }, 1500)

      if (direction == 1) {
        if ((this.states.currentSlide < this.states.length - 1) && (this.states.currentSlide !== false) && (this.states.currentSlide < this.options.segments - 1)) {
          this.clearSliderStates();
          this.states.currentSlide = this.states.currentSlide + direction;
          this.bgsContainers[this.states.currentSlide].classList.add("forward");
          setTimeout(() => {
            this.bgsContainers[this.states.currentSlide].classList.add("active");
          }, 50);
          this.bgsContainers[this.states.currentSlide].classList.add("stop");
          ((this.states.currentSlide - 1) >= 0) ? this.bgsContainers[this.states.currentSlide - 1].classList.add("played") : this.bgsContainers[(this.states.length - 1)].classList.add("played");
          this.progressSegments[this.states.currentSlide].classList.add("active");
          this.clearTitles();
          if (this.titles[this.states.currentSlide]) this.titles[this.states.currentSlide].classList.add("active");
        } else {
          if (this.states.currentSlide !== false) {
            this.container.classList.add("formenu");
            this.container.querySelector(".cover-anim-titles").classList.add("disabled");
            setTimeout(()=>{
              document.querySelector(".next").classList.remove("disabled");
            }, 600);
            this.cover.classList.remove("show-right");
            this.cover.classList.add("hide-left");
            this.clearTitles();
            this.clearSliderStates();
            this.bgsContainers[this.states.currentSlide].classList.add("hide-forward");
            this.expandSlider();
            this.states.currentSlide = false;
          }
        };
      } else {
        if (this.states.currentSlide > 0) {
          this.clearSliderStates();
          this.bgsContainers[this.states.currentSlide].classList.add("played");
          this.states.currentSlide = this.states.currentSlide + direction;
          this.bgsContainers[this.states.currentSlide].classList.add("backward");
          setTimeout(() => {
            this.bgsContainers[this.states.currentSlide].classList.add("active");
          }, 50);
          this.progressSegments[this.states.currentSlide + 1].classList.remove("active");
          this.clearTitles();
          if (this.titles[this.states.currentSlide]) this.titles[this.states.currentSlide].classList.add("active");
        } else {
          if (this.states.currentSlide===false) {
            this.container.querySelector(".cover-anim-titles").classList.remove("disabled");
            document.querySelector(".next").classList.add("disabled");
            this.container.classList.remove("formenu");
            this.cover.classList.remove("hide-left");
            this.cover.classList.add("show-right");
            this.states.currentSlide = this.bgsContainers.length - 1;
            this.bgsContainers[this.states.currentSlide].classList.add("active");
            this.bgsContainers[this.states.currentSlide].classList.remove("hide-forward");
            if (this.titles[this.states.currentSlide]) this.titles[this.states.currentSlide].classList.add("active");
          }else{
            setTimeout(()=>{
              this.clearSlider();
            }, 1000);
            this.states.isdisablesScroll = true;
            this.states.currentSlide = 0;
            this.intro.classList.remove("close");
            this.cover.classList.remove("step-1", "step-2", "hide-left", "show-right");
          }
        };
      }
    }
  }

  clearTitles = () => {
    this.titles.forEach((title) => {
      title.classList.remove("active");
    })
  }

  clearSliderStates = () => {
    this.bgsContainers.forEach((bgContainer) => {
      bgContainer.classList.remove("active");
      bgContainer.classList.remove("played");
      bgContainer.classList.remove("forward");
      bgContainer.classList.remove("backward");
    })
  }

  expandSlider = () => {

  }

  clearSlider = () => {
    this.states.currentSlide = 0;
    this.bgsContainers.forEach((bgContainer) => {
      bgContainer.classList.remove("active");
      bgContainer.classList.remove("stop");
      bgContainer.classList.remove("played");
      bgContainer.classList.remove("forward");
      bgContainer.classList.remove("backward");
    })
    this.progressSegments.forEach((progress) => {
      progress.classList.remove("active");
    })
    this.bgsContainers[this.states.currentSlide].classList.add("forward");
    this.bgsContainers[(this.states.length - 1)].classList.add("played");
    setTimeout(() => {
      this.bgsContainers[this.states.currentSlide].classList.add("active");
      this.bgsContainers[this.states.currentSlide].classList.add("stop");
    }, 50)
    setTimeout(() => {
      this.progressSegments[this.states.currentSlide].classList.add("active");
    }, 50);

    this.clearTitles();
    if (this.titles[this.states.currentSlide]) this.titles[this.states.currentSlide].classList.add("active");
  }

  buildBgs() {
    this.bgsContainers = this.container.querySelectorAll(".cover-anim-bg");
    const segment = document.createElement("div");
    const bg = document.createElement("div");
    let segments = [];
    this.states.length = this.bgsContainers.length;

    segment.classList.add("cover-anim-bg-segment");

    this.bgsContainers.forEach((bgContainer, i) => {
      let style = null;
      let img = null;
      segments[i] = [];

      img = bgContainer.querySelector("img");
      img ? style = 'background:url(' + img.src + ')' : style = 'background-color: #000';

      if (img) img.remove();

      for (let y = 0; y < this.options.segments; y++) {
        segments[i].push(segment.cloneNode());
        let temp = bg.cloneNode();
        temp.setAttribute("style", style);
        segments[i][y].appendChild(temp);
        bgContainer.appendChild(segments[i][y]);
      }
    });
  }

  buildBar() {
    const progress = document.createElement("div");
    const segment = document.createElement("div");
    const bar = document.createElement("div");
    const label = document.createElement("div");
    this.progressSegments

    progress.classList.add("cover-anim-progress");
    segment.classList.add("cover-anim-progress-segment");
    bar.classList.add("cover-anim-progress-bar");
    label.classList.add("cover-anim-progress-label");

    this.container.appendChild(progress);

    for (let i = 0; i < this.options.segments; i++) {
      this.progressSegments.push(segment.cloneNode());
      let temp = label.cloneNode();
      if (i < this.bgsContainers.length) temp.innerHTML = "0" + (i + 1);
      this.progressSegments[i].appendChild(temp);
      this.progressSegments[i].appendChild(bar.cloneNode());
      progress.appendChild(this.progressSegments[i]);
    }

  }

  show() {
    this.bgsContainers[this.states.currentSlide].classList.add("forward");
    this.bgsContainers[this.states.currentSlide].classList.add("active");
  }

  play() {
    this.bgsContainers[this.states.currentSlide].classList.add("stop");
    this.progressSegments[this.states.currentSlide].classList.add("active");
    this.titles[this.states.currentSlide].classList.add("active")

    setInterval(() => {
      if (!this.states.isPaused) {
        this.loop();
      }
    }, this.options.slideDelay);
  }

  loop() {

    if (!this.states.isPaused) {
      this.move(1);
    }
  }
}