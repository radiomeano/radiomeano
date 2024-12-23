import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Chiave API di Last.fm (sostituisci con la tua)
const apiKey = process.env.REACT_APP_LASTFM_API_KEY;

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  // Riferimenti per i titoli
  const titleRef = useRef(null);
  const artistRef = useRef(null);

  // Stato per abilitare lo scorrimento
  const [isTitleScrollable, setIsTitleScrollable] = useState(false);
  const [isArtistScrollable, setIsArtistScrollable] = useState(false);

  const defaultCover = process.env.PUBLIC_URL + '/logo.png';

  // Funzione per cercare la copertina tramite Last.fm
  const fetchCoverFromLastFM = async (artist, title) => {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json`
      );
      const data = await response.json();
      if (data?.track?.album?.image?.length > 0) {
        return data.track.album.image[2]["#text"]; // Immagine di medie dimensioni
      }
      return null; // Nessuna immagine trovata
    } catch (error) {
      console.error("Errore nel caricamento della copertina da Last.fm:", error);
      return null;
    }
  };

  const getCoverImage = async () => {
    if (currentSong?.artist?.image) {
      const imageUrl = currentSong.artist.image;
      return imageUrl.startsWith('http://')
        ? imageUrl.replace('http://', 'https://')
        : imageUrl;
    }

    // Fallback su Last.fm
    if (currentSong?.artist?.name && currentSong?.title) {
      const lastFmCover = await fetchCoverFromLastFM(currentSong.artist.name, currentSong.title);
      if (lastFmCover) return lastFmCover;
    }

    return defaultCover; // Immagine di default
  };

  useEffect(() => {
    const fetchCurrentSong = async () => {
      try {
        const response = await fetch('https://api.laut.fm/station/meteomeano/current_song');
        const data = await response.json();
        setCurrentSong(data);
      } catch (error) {
        console.error('Errore nel recupero del brano corrente:', error);
      }
    };

    fetchCurrentSong();
    const interval = setInterval(fetchCurrentSong, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Verifica se il titolo e l'artista devono scorrere
    if (titleRef.current) {
      setIsTitleScrollable(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
    if (artistRef.current) {
      setIsArtistScrollable(artistRef.current.scrollWidth > artistRef.current.clientWidth);
    }
  }, [currentSong]);

  return (
    <div className="App">
      <header>
        <h1>Radio Meano</h1>
      </header>
      <main>
        {currentSong ? (
          <div className="song-info">
            <img
              src={currentSong?.coverUrl || defaultCover}
              alt={currentSong.title || 'Radio Meano'}
              className="cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultCover;
              }}
            />
            {/* Titolo */}
            <div
              className={`marquee-container ${isTitleScrollable ? 'scrollable' : ''}`}
              ref={titleRef}
            >
              <span>{currentSong.title || 'Ora in onda'}</span>
            </div>
            {/* Artista */}
            <div
              className={`marquee-container ${isArtistScrollable ? 'scrollable' : ''}`}
              ref={artistRef}
            >
              <span>{currentSong.artist?.name || 'Artista sconosciuto'}</span>
            </div>
          </div>
        ) : (
          <p>Caricamento in corso...</p>
        )}
        <audio controls src="https://stream.laut.fm/meteomeano"></audio>
      </main>
      <footer>
        <p>&copy; 2024 Radio Meano. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}

export default App;
