import icons from 'url:../../img/icons.svg' //Parcel 2


export default class View {

  _data;
/**
 * 
 * @param {Object || Object[]} data 
 * @param {*} render 
 * @returns 
 */
  render(data, render = true) {
      if(!data || Array.isArray(data) && data.length === 0) return this.renderError();
      this._data = data;
      console.log(this._data);
      const markup = this._generateMarkup()

      

      if(!render) return markup;

      this._clear()
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // if(!data || Array.isArray(data) && data.length === 0) return this.renderError();
    this._data = data;
    console.log(this._data);
    const newMarkup = this._generateMarkup()
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);
    // console.log(currElements);

    newElements.forEach((newEl, i) => {
      const curElem = currElements[i];
      // console.log(curElem, newEl.isEqualNode(curElem));

      if(!newEl.isEqualNode(curElem) && newEl.firstChild?.nodeValue.trim() !== '') {
        curElem.textContent = newEl.textContent;

      }
     

      // Update Changed Attributes
      if(!newEl.isEqualNode(curElem));

        Array.from(newEl.attributes).forEach(attr => curElem.setAttribute(attr.name, attr.value))
    
      });

  }

  _clear() {
    console.log(this._parentElement);
    this._parentElement.innerHTML = '';
  }

  renderSpinner () {
      const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
      </div>`;
      

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }

    

      renderError(message = this._errorMessage) {
          const markup = `<div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }

      renderMessage(message = this._message) {
          const markup = `<div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }
}