import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import { getSearchMovies } from './comManager.js';
// import { getNextPage } from './comManager.js';
// import { getPrevPage } from './comManager.js';

createApp({
    data() {
        return {
            pantalla: 'inicio',
            peliActual: null,
            movies: [],
            movie: [],
            inputValue: null,
            showInfo: false,
            boughtMovies: [],
            shoppingCartCount: 0,
            totalCart: 0,
            user: { name: '', email: '' },
            localStorageSetted: false,
        }
    },
    created() {
        if (localStorage.getItem('user')) {
            this.getLocalStorage();
            this.localStorageSetted = true;
        } else {
            this.localStorageSetted = false;
        }
    },
    mounted() {
        getSearchMovies(this.inputValue)
            .then(data => {
                this.movies = data;
            });
    },
    methods: {
        handleSubmit() {
            if (this.inputValue == null || this.inputValue == "") {
                this.movie = [];
            } else {
                const nameMovie = this.inputValue.toLowerCase();
                this.movie = this.movies.filter(movie => movie.Title.toLowerCase().includes(nameMovie));
            }
        },
        returnToList() {
            this.pantalla = "inicio"
            this.boughtMovies = [];
            this.shoppingCartCount = 0;
            this.totalCart = 0;
        },
        addCountMovie(id) {
            if (this.movie.length == 0) {
                this.movies[id].count++;
            } else {
                this.movie[id].count++;
            }
        },
        substractCountMovie(id) {
            if (this.movie.length == 0) {
                if (this.movies[id].count >= 1) {
                    this.movies[id].count--;
                }
            } else {
                if (this.movie[id].count >= 1) {
                    this.movie[id].count--;
                }
            }
        },
        addToCart(id) {
            if (this.movie.length == 0) {
                if (this.movies[id].count >= 1) {
                    let elementosRepetidos = this.repeatedMovie(id);
                    if (elementosRepetidos.length === 0) {
                        this.boughtMovies = [...this.boughtMovies, { ...this.movies[id] }];
                    } else {
                        let index = this.findByIndex(this.boughtMovies, id);
                        this.boughtMovies[index].count += this.movies[id].count;
                    }
                    this.shoppingCartCount += this.movies[id].count;
                    this.totalCart += ((this.movies[id].Price) * this.movies[id].count);
                    this.movies[id].count = 0;
                }
            } else {
                if (this.movie[id].count >= 1) {
                    let elementosRepetidos = this.repeatedMovie(id);
                    if (elementosRepetidos.length === 0) {
                        this.boughtMovies = [...this.boughtMovies, { ...this.movie[id] }];
                    } else {
                        let index = this.findByIndex(this.boughtMovies, id);
                        this.boughtMovies[index].count += this.movie[id].count;
                    }
                    this.shoppingCartCount += this.movie[id].count;
                    this.totalCart += ((this.movie[id].Price) * this.movie[id].count);
                    this.movie[id].count = 0;
                }
            }
        },
        repeatedMovie(id) {
            return this.boughtMovies.filter(movie => movie.imdbID === this.movies[id].imdbID);
        },
        findByIndex(movArray, id) {
            return movArray.findIndex(movie => movie.imdbID === this.movies[id].imdbID);
        },
        goToShop() {
            this.pantalla = "tienda";
        },
        decreaseCart(id) {
            this.totalCart -= this.boughtMovies[id].Price;
            if (this.boughtMovies[id].count != 1) {
                this.boughtMovies[id].count--;
            } else {
                this.boughtMovies.splice(this.findByIndex(this.boughtMovies, id), 1);
            }
            this.shoppingCartCount--;
        },
        buy() {
            this.pantalla = "ticket";
        },
        removeAll(id) {
            this.totalCart -= (this.boughtMovies[id].Price) * this.boughtMovies[id].count;
            this.shoppingCartCount -= this.boughtMovies[id].count;
            this.boughtMovies.splice(id, 1);
        },
        setLocalStorageUser() {
            localStorage.setItem('user', JSON.stringify(this.user));
        },
        getLocalStorage() {
            const userString = localStorage.getItem('user');
            this.user = JSON.parse(userString);
        },
        removeLocalStorage() {
            localStorage.removeItem('user');
            user.name = '';
            user.email = '';
        }

    },
    computed: {
        totalCartFormatted() {
            return this.totalCart.toFixed(2);
        }
    }
}).mount('#app');
