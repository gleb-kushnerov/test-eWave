import {Rating} from "./rating";
import {MovieStorage} from "./indexedDb";

export class NewMovieElement {
    constructor(){
        this.inputEl = document.getElementById('movie-input-field');
        this.addBtnEl = document.getElementById('add-btn');
        this.addBtnEl.addEventListener('click', this);
        this.rating = new Rating();
        this.storage = new MovieStorage();
        this.storage.init();
    }

    async handleEvent() {
        if (this.inputEl.value !== '') {
            let liEl = document.createElement('li'),
                liElHtmlStr = await fetch(require('../content/new-list-el-html-content.html')).then(res => res.text());
            liEl.dataset.rating = '0';
            liEl.dataset.id = this.setDataId();
            liEl.innerHTML = liElHtmlStr;
            this.rating.listEl.append(liEl);
            liEl.firstElementChild.textContent = this.inputEl.value;
            this.inputEl.value = '';
            let movieInfo = {
                movie: liEl.firstElementChild.textContent,
                rating: '0',
                id: liEl.dataset.id,
                created: false
            };
            this.storage.add(movieInfo, liEl.dataset.id);
        }
    }

    setDataId() {
        let liCollection = this.rating.listEl.children,
            id = 0;
        for (let li of liCollection) {
            if (Number(li.dataset.id) > id) {
                id = li.dataset.id;
            }
        }
        return Number(id) + 1;
    }
}