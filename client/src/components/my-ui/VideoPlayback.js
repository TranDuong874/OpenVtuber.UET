import '../../css/App.css';
import { useEffect, useState } from 'react';
import { useLocalVideo } from '../../hooks/useLocalVideoProvider';
const VideoPlayback = () => {
    const [frames, setFrames] = useState([]);  // Array to store frames
    const {localVideoUrl, setLocalVideoUrl, videoFrame, setVideoFrame} = useLocalVideo();

    // Function to extract frames from the video
    const extractFrames = (videoUrl) => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.muted = true;
        video.crossOrigin = 'anonymous';

        video.addEventListener('loadeddata', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const frameInterval = 1 / 30;  // Extract 24 frames per second (you can adjust the frame rate)
            const totalFrames = Math.floor(video.duration * 30);  // Calculate total frames based on duration

            let frameArray = [];
            
            // Function to capture each frame
            const captureFrame = () => {
                ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
                frameArray.push(canvas.toDataURL('image/png'));  // Store frame as base64 image

                if (frameArray.length < totalFrames) {
                    video.currentTime += frameInterval;
                } else {
                    setFrames(frameArray);  // Store all frames once completed
                }
            };

            video.addEventListener('seeked', captureFrame);
            video.currentTime = 0;  // Start extracting frames
        });
    };

    // When the local video URL is ready, extract frames
    useEffect(() => {
        if (localVideoUrl) {
            extractFrames(localVideoUrl);
        }
    }, [localVideoUrl]);

    return (
        <div className="video-playback">
            {/* Slider to control the displayed frame */}
            {frames.length > 0 && (
                <img src={frames[videoFrame]} alt={`Frame ${videoFrame}`} height='100%' />
                
            )}
        </div>
    );
}
 
export default VideoPlayback;