import React, { useState, useEffect } from "react";

const MusicPlayer = (props) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = props.nowPlaying;
    if (audio) {
      const updateTime = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };

      audio.addEventListener("timeupdate", updateTime);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
      };
    }
  }, [props.nowPlaying]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeekBarChange = (e) => {
    const seekTime = e.target.value;
    const audio = props.nowPlaying;
    if (audio) {
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const audio = props.nowPlaying;
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
    }
  };

  return (
    <div className="player">
      <i
        className={props.isPlaying ? "fa fa-pause" : "fa fa-play"}
        onClick={() => props.toggleMusic(props.audioUrl)}
        aria-hidden="true"
      ></i>
      <div className="seek-bar-container">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeekBarChange}
          className="seek-bar"
        />
        <div className="seek-bar-time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="volume-container">
        
      <i  className={volume===0 ? "fa fa-volume-mute" : "fa fa-volume-up"} aria-hidden="true"></i>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-bar"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
