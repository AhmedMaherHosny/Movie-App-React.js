import {useEffect, useState} from 'react'
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {getTrendingMovies, updateSearchCount} from "./app_write/appWrite.js";

const App = () => {
    const API_BASE_URL = 'https://api.themoviedb.org/3'
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY
    const API_OPTIONS = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    }

    const [searchText, setSearchText] = useState('')
    const [debouncedSearchText, setDebouncedSearchText] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [movieList, setMovieList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [trendingMovies, setTrendingMovies] = useState([])

    useDebounce(() => {
        setDebouncedSearchText(searchText)
    }, 700, [searchText])
    const fetchMovies = async (query = '') => {
        setIsLoading(true)
        setErrorMessage('')
        try {
            const ENDPOINT = query
                ? `${API_BASE_URL}/search/movie?query=${query}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
            const response = await fetch(ENDPOINT, API_OPTIONS)
            if (!response.ok) {
                throw new Error('An error occurred while fetching data')
            }
            const data = await response.json()
            if (data.response === 'False') {
                setErrorMessage(data.Error)
                setMovieList([])
                return
            }
            setMovieList(data.results || [])
            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0])
            }
        } catch (error) {
            console.error(error)
            setErrorMessage('An error occurred while fetching data')
        } finally {
            setIsLoading(false)
        }
    }
    const loadTrendingMovies = async () => {
        try {
            const trendingMoviesResponse = await getTrendingMovies()
            setTrendingMovies(trendingMoviesResponse)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchMovies(debouncedSearchText)
    }, [debouncedSearchText])
    useEffect(() => {
        loadTrendingMovies()
    }, [])

    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper">
                <Header/>
                <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                    <img src={movie.posterUrl} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                <section className="all-movies">
                    <h2>All Movies</h2>
                    {isLoading ? (<LoadingSpinner/>) : errorMessage ? (
                        <p className='text-white'>{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}
export default App
