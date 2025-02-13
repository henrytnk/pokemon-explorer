import pokeballLogo from './assets/pokeball-bg.webp';
import './App.scss';
import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function App() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [error, setError] = useState(null);

  const { data: searchResults, refetch, isFetching } = useQuery({
    queryKey: ['pokemon', searchKeyword],
    queryFn: async () => {
      try {
        setError(null); // Reset error state before fetching
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchKeyword.toLowerCase()}`);
        return response;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No Pokémon found.');
        } else {
          setError('An error occurred. Please try again.');
        }
        throw err;
      }
    },
    enabled: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchKeyword.trim() !== '') {
      refetch();
    }
  };

  const handleOnChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <>
      <div className="pokeball-bg">
        <div className="pokeball-bg-overlay"></div>
        <img src={pokeballLogo} className="pokeball-bg-img" alt="Pokéball Background" />
      </div>
      <div className="search-bar">
        <h2>Search Pokémon</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="searchBar"
            id="searchBar"
            placeholder="Search"
            value={searchKeyword}
            onChange={handleOnChange}
          />
          <button type="submit"><CiSearch /></button>
        </form>
      </div>

      {isFetching && <p>Loading...</p>}

      {!isFetching && error && <p className="error-message">{error}</p>}

      {searchResults?.data && !error && (
        <div className="pokemon">
          <img
            src={searchResults.data.sprites.front_default}
            alt={searchResults.data.name}
            className="pokemon-card-img"
          />
          <h3>{searchResults.data.name}</h3>
          <p>Height: {searchResults.data.height}</p>
          <p>Weight: {searchResults.data.weight}</p>
        </div>
      )}
    </>
  );
}

export default App;
