
import icons from 'url:../../img/icons.svg' //Parcel 2
import previewView from './previewView.js';

import View from './View.js';

class ResultsView extends View {
    _parentElement = document.querySelector('.results');
    _errorMessage = `No Recipes Found For your Query, Please try another one 🙏`;
    _message = ``;
    

    _generateMarkup () {
      return this._data.map(result => previewView.render(result, false)).join('');

      
  }
}
export default new ResultsView();