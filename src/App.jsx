import Search from "./components/Search";
import { Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endPoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("response was not ok");
      }
      const data = await response.json();
      if (data.Response === "False") {
        setMovies([]);
        setErrorMessage("failed to fetch movies");
        return;
      }
      console.log(data);
      setMovies(data.results || []);
    } catch (e) {
      console.log(e);
      setErrorMessage("error while fetchingg movies please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, []);
  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <div className="text-center">
              <Spinner
                color="purple"
                aria-label="Extra large spinner Center-aligned"
                size="xs"
              />
            </div>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard movie={movie } key={movie.id}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
