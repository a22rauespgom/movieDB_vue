// const key = 'f46aa449';

export async function getSearchMovies(input) {
    // const response = await fetch(`http://www.omdbapi.com/?s=${input}&apikey=${key}`);
    const response = await fetch(`./movies.json`);
    const movies = await response.json();
    return movies.Search;
}


