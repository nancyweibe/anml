export default class SepText {
  constructor() {
    this.texts = [];
    this.init();
    this.isReady = false;
  }

  init() {
    this.texts = document.querySelectorAll("[data-sep]");

    this.texts.forEach(text => {
      let letters = text.innerHTML.trim().split("");
      text.innerHTML = "";

      letters.forEach(letter => {
        let wrapper = document.createElement("div");
        wrapper.classList.add("d" + this.getRandom(3));
        letter != " "
          ? (wrapper.innerHTML = letter)
          : (wrapper.innerHTML = "&nbsp;");
        text.appendChild(wrapper);
      });
    });

    this.isReady = true;
  }

  play() {
    this.texts.forEach(text => {
      text.classList.add("play");
    });
  }

  getRandom = n => {
    return Math.floor(Math.random() * n);
  };
}
