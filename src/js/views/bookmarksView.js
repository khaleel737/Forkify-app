
import icons from 'url:../../img/icons.svg' //Parcel 2
import previewView from './previewView.js';

import View from './View.js';

class BookMarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = `No BookMarks, Please find a recipe and bookmark it 🙏`;
    _message = ``;

    addHandlerRender(handler) {
      window.addEventListener('load', handler);

    }
    
    _generateMarkup () {

        return this._data.map(bookmark => previewView.render(bookmark, false)).join('');

    }
}
export default new BookMarksView();