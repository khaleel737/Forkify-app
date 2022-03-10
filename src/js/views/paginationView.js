import icons from 'url:../../img/icons.svg' //Parcel 2

import View from './View.js';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');
    _next;
    _previous;
   
    addHandlerClick (handler) {
        this._parentElement.addEventListener('click', function(e) {
            const button = e.target.closest('.btn--inline');

            if(!button) return;
            console.log(button);
            const goToPage = +button.dataset.goto;
            console.log(goToPage);
            // Handler accepts the value
            handler(goToPage);
        })
    }
    
    _Buttons (currPage) {
        this._next = `<button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${currPage + 1}</span>
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
        </svg>
        </button>`;

        this._previous = `<button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currPage - 1}</span>
        </button>`;

    }

    _generateMarkup () {
        const currentPage = this._data.page;
        this._Buttons(currentPage)

        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        console.log(numPages);
        
        // Scenario 1, we are on page 1 and there is another page
        if(currentPage === 1 && numPages > 1) {
            return this._next;
            
        }
        
        // We are on last page
        if(currentPage === numPages && numPages > 1) {
            return this._previous;
        }
        
        // Other Pages
        if(currentPage < numPages){
            return [this._next,  this._previous];
        }
        
        
        return '';
        
        // // Scenario 2, we are on page 1 and there is NOO other pages
        // if(this._data.page === 1 && numPages <= 1) {
            //     return `What up man, im only one page`
            // }
        }
    }
    
export default new PaginationView();