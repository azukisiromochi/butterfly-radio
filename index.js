"use strict";

const SHADOW_ROOT_STYLE = `
<style>
:host {
position: relative;
}

.butterfly {
position: inherit;
top: -3em;
width: 2.5em;
height: 2.5em;
transition: all 1000ms 0s ease-in;
}
.butterfly-on {
transform: translateX(2.5em) translateY(2.5em);
}
.butterfly-off {
transform: translateX(5em) translateY(0) rotate(-30deg) scale(.3);
}
.butterfly-far {
transform: rotate(60deg) scale(.3);
}
.butterfly-hidden {
visibility : hidden;
}
input[type="radio"] {
filter: alpha(opacity=0);
-moz-opacity: 0;
opacity: 0;
position: absolute;
}
.butterfly-radio + label {
background-image: url('../assets/flower-off.png');
background-repeat: no-repeat;
background-size: contain;
height: 2em;
line-height: 2em;
display: inline-block;
padding: 0 0 0 2.5em;
cursor: pointer;
overflow: hidden;
}
.butterfly-radio:checked + label {
background-image: url('../assets/flower-on.png');
background-repeat: no-repeat;
background-size: contain;
}
</style>
`;

class ButterflyRadio extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({mode: 'open'});
    this._shadowRoot.innerHTML = SHADOW_ROOT_STYLE;
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    const name = this.getAttribute('name');

    let value;
    Array.from(this.children).forEach((el) => {
      if (el instanceof HTMLInputElement) {
        if (el.type === 'radio') {
          el.name = name;
          value = el.value;
          el.id = 'flower-' + name + '-' + value;
          el.classList.add('butterfly-radio');

          // Make butterfly image.
          const _img = document.createElement('img');
          _img.src = '../assets/butterfly.png';
          _img.classList.add('butterfly');
          _img.classList.add('butterfly-far');
          _img.classList.add('butterfly-hidden');
          _img.id = 'butterfly-' + name + '-' + value;

          // Add change event to radio.
          el.addEventListener('change', (event) => {
            if (el === event.target) {
              if (event.target.value) {
                this._fly(_img);
                this._onFlower(_img);
              }
            }
          }, false);

          // Add elem to shadow root.
          this._shadowRoot.appendChild(_img);
          this._shadowRoot.appendChild(el);
        }
      }

      // Add label to shadow root.
      if (el instanceof HTMLLabelElement) {
        el.htmlFor = 'flower-' + name + '-' + value;
        this._shadowRoot.appendChild(el);
      }
    });
  }

  _fly(target) {
    Array.from(this._shadowRoot.children).forEach((el) => {
      if (el instanceof HTMLImageElement) {
        if (el !== target) {
          el.classList.add('butterfly-off');
          el.classList.add('butterfly-hidden');
          el.classList.remove('butterfly-on');
          wait(1000).then(() => {
            el.classList.add('butterfly-hidden');
            el.classList.remove('butterfly-off');
            el.classList.add('butterfly-far');
          });
        }
      }
    });
  }

  _onFlower(butterfly) {
    butterfly.classList.remove('butterfly-hidden');
    butterfly.classList.remove('butterfly-far');
    butterfly.classList.add('butterfly-on');
  }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const butterflyRadio = () => customElements.define('butterfly-radio', ButterflyRadio);

module.exports = butterflyRadio;
