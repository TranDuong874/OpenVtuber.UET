import React, { useState, useRef, useEffect } from 'react';
import '../../css/App.css';

const VideoPlayback = () => {
    const [playButton, setPlayButton] = useState('Start');
    const [playbackTime, setPlaybackTime] = useState(0);

    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        const updatePlaybackTime = () => {
            setPlaybackTime(video.currentTime);
        };

        // Set the interval to update every interva < 1/FPS
        const intervalId = setInterval(updatePlaybackTime, 10);

        return () => {
            clearInterval(intervalId); // Clean up the interval
        };
    }, []);

    const handlePlayButton = () => {
        const video = videoRef.current;
        if (playButton === 'Start') {
            setPlayButton('Stop');
            video.play();
        } else {
            setPlayButton('Start');
            video.pause();
        }
    };

    return (
        <div className='video-container'>
            Current Frame: {playbackTime.toFixed(2)} seconds
            <video height='80%' id='video' ref={videoRef}>
                <source src='./vid.mp4'></source>
            </video>
            <div className='play-back-controller'>
                <button onClick={handlePlayButton}>{playButton}</button>
                <input className='video-slider' type='range' min='0'></input>
            </div>
        </div>
    );
};

export default VideoPlayback;
