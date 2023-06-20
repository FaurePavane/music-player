import React, { useState, useEffect } from "react";
import Navbar from './components/Navbar';
import MusicCard from "./components/MusicCard";
import MusicPlayer from './components/MusicPlayer';




function App() {
  const [lightMode, setLightMode] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [numMusicCards, setNumMusicCards] = useState(0);
  const [covers, setCovers] = useState([]);
  const [musics, setMusics] = useState([]);



  // //Request to API (Melobit)
  // useEffect(() => {
  //   fetch('https://api-beta.melobit.com/v1/song/new/0/100')
  //     .then(res => res.json())
  //     .then(data => {
  //       setNumMusicCards(data.total);
  //       setCovers(data.results.map(result => result.image.cover.url));
  //       setMusics(data.results.map(result => result.audio.medium.url));
  //     })
  //     .catch(error => {

  //       console.error(error);
  //     });
  // }, []);


//Request to localhost 
  useEffect(() => {
    fetch(`http://localhost:5000/uploads`)
      .then(res => res.json())
      .then(data => {
        const jpgFiles = data.filter(item => item.endsWith('.jpg'));
        const mp3Files = data.filter(item => item.endsWith('.mp3'));

        const matchedFiles = jpgFiles.map(jpgFile => {
          const fileName = jpgFile.replace('.jpg', '');
          const matchingMp3 = mp3Files.find(mp3File => mp3File.replace('.mp3', '') === fileName);
          return {
            cover: `http://localhost:5000/uploads/${jpgFile}`,
            music: `http://localhost:5000/uploads/${matchingMp3}`
          };
        });

        setNumMusicCards(jpgFiles.length);
        setCovers(matchedFiles.map(file => file.cover));
        setMusics(matchedFiles.map(file => file.music));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const cardsPerRow = 7; //Default : 7
  const numRows = Math.ceil(numMusicCards / cardsPerRow);

  const generateMusicCards = () => {
    if (numMusicCards === 0 || covers.length === 0 || musics.length === 0) {
      return null;
    }

    const musicCards = [];
    for (let i = 0; i < numMusicCards; i++) {
      musicCards.push(
        <MusicCard
          key={i}
          cover={covers[i]}
          toggleMusic={toggleMusic}
          isPlaying={isPlaying}
          audio={musics[i]}
        />
      );

    }

    return musicCards;
  };

  const generateRows = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const startIndex = i * cardsPerRow;
      const endIndex = startIndex + cardsPerRow;
      const musicCards = generateMusicCards()?.slice(startIndex, endIndex);
      rows.push(
        <div className="music--card--container" key={i}>
          {musicCards}
        </div>
      );
    }
    return rows;
  };

  function playAudio(audioUrl) {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    setCurrentAudioUrl(audioUrl);
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Failed to play audio:", error);
      });
  }

  function toggleMusic(audioUrl) {
    if (currentAudio && currentAudio.src === audioUrl) {
      if (isPlaying) {
        currentAudio.pause();
      } else {
        currentAudio.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      playAudio(audioUrl);
    }
  }

  //Check if any audio ended 
  useEffect(() => {
    function handleEnded() {
      setCurrentAudio(null);
      setIsPlaying(false);
    }

    if (currentAudio) {
      currentAudio.addEventListener("ended", handleEnded);
      return () => currentAudio.removeEventListener("ended", handleEnded);
    }
  }, [currentAudio]);

  return (
 

      <div className={lightMode && 'light-mode'}>
        <Navbar lightMode={lightMode} setLightMode={setLightMode} />
        <div className='music'>
          {generateRows()}
        </div>
        {currentAudio && (
          <MusicPlayer
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            toggleMusic={toggleMusic}
            nowPlaying={currentAudio}
            audioUrl={currentAudioUrl}
          />
        )}
      </div>

 
  );
}

export default App;