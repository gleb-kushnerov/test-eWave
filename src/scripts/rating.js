import {MovieStorage} from "./indexedDb";

export class Rating {
    constructor() {
        this.listEl = document.getElementById('movie-list');
        this.listEl.addEventListener('click', this);
        this.storage = new MovieStorage();
        this.storage.init();
        this.checkStorageRating();
    }

    handleEvent(event) {
        let starEl = event.target.closest('.fa');
        if (starEl) {
            let liEl = starEl.parentElement.parentElement;
            liEl.dataset.rating = starEl.dataset.number;
            let parent = starEl.parentElement,
                starCollection = parent.children;

            for (let star of starCollection) {
                star.classList.remove('active');
                if (star.dataset.number <= starEl.dataset.number) {
                    star.classList.add('active');
                }
            }
            this.sortMovies(this.listEl);
            this.makeMarkInStorage(liEl, starEl);
        }
    }

    sortMovies(list) {
        let liCollection = [...list.children];
        liCollection
            .sort((a, b) => {
                if (a.firstElementChild.textContent > b.firstElementChild.textContent) {
                    return 1;
                }
                if (a.firstElementChild.textContent < b.firstElementChild.textContent) {
                    return -1;
                }
                return 0;
            })
            .sort((a, b) => {
                    if (a.dataset.rating > b.dataset.rating) {
                        return -1;
                    }
                    if (a.dataset.rating < b.dataset.rating) {
                        return 1;
                    }
                    return 0;
                })
            .forEach(el => this.listEl.append(el));
    }

    async makeMarkInStorage(liEl, starEl) {
        let movieInfo = {
            movie: liEl.firstElementChild.textContent,
            rating: starEl.dataset.number,
            id: liEl.dataset.id,
            created: true
        },
            movie = await this.storage.get(liEl.dataset.id);
        if (movie) {
            this.storage.change(liEl.dataset.id, starEl.dataset.number)
        } else {
            this.storage.add(movieInfo, liEl.dataset.id);
        }
    }

    async checkStorageRating() {
        await this.storage.init();
        let movies = await this.storage.getAll(),
            liCollection = this.listEl.children;
        for (let movie of movies) {
            if (!movie.created) {
                let liEl = document.createElement('li'),
                    liElHtmlStr = await fetch(require('../content/new-list-el-html-content.html')).then(res => res.text());
                liEl.dataset.rating = '0';
                liEl.dataset.id = this.setDataId();
                liEl.innerHTML = liElHtmlStr;
                this.listEl.append(liEl);
            }
            for (let liEl of liCollection) {
                if (liEl.dataset.id === movie.id) {
                    let starCollection = liEl.querySelector('.rating').children;
                    for (let star of starCollection) {
                        if (star.dataset.number <= movie.rating) {
                            star.classList.add('active');
                        }
                    }
                    liEl.dataset.rating = movie.rating;
                    this.sortMovies(this.listEl);
                    if (!movie.created) {
                        liEl.firstElementChild.textContent = movie.movie;
                    }
                }
            }
        }
    }

    setDataId() {
        let liCollection = this.listEl.children,
            id = 0;
        for (let li of liCollection) {
            if (Number(li.dataset.id) > id) {
                id = li.dataset.id;
            }
        }
        return Number(id) + 1;
    }
}