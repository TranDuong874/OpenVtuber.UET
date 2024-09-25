import { useState, useEffect } from "react";
import axios from 'axios';
import { useFacialData } from '../../hooks/useFacialData';
import { useLocalVideo } from '../../hooks/useLocalVideoProvider';
import * as THREE from 'three'; // Import THREE

const VideoUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobId, setJobId] = useState(null);
    const {localVideoUrl, setLocalVideoUrl} = useLocalVideo();
    const { facialData, setFacialData } = useFacialData();
    const [processingStatus, setProcessingStatus] = useState(null);
    const {videoFrame, setVideoFrame} = useLocalVideo();

    // Function to handle file selection
    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to handle video upload
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) return alert('Please select a video file to upload.');
        
        const formData = new FormData();
        formData.append("uploaded-file", selectedFile);

        try {
            const response = await axios.post("http://localhost:4000/openvtuber/upload-video", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            setJobId(response.data.jobId);
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    // Function to download the video file and create a local URL for playback
    const downloadVideoFile = async (jobId) => {
        try {
            const response = await axios({
                url: `http://localhost:4000/openvtuber/download/${jobId}/video`,
                method: 'GET',
                responseType: 'blob', // Important for downloading video
            });
            const videoBlob = new Blob([response.data], { type: 'video/mp4' });
            const videoUrl = URL.createObjectURL(videoBlob);  // Create URL from Blob
            setLocalVideoUrl(videoUrl);  // Set URL for video playback
        } catch (error) {
            console.error('Error downloading video:', error);
        }
    };

    // Function to download the JSON file and set facial data
    const downloadJsonFile = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:4000/openvtuber/download/${jobId}/json`);
            setFacialData(response.data);  // Store the facial data in state
        } catch (error) {
            console.error('Error downloading JSON:', error);
        }
    };


    // Effect to handle job progress via SSE and initiate file downloads
    useEffect(() => {
        if (jobId) {
            const eventSource = new EventSource(`http://localhost:4000/openvtuber/events/${jobId}`);

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setProcessingStatus(data.status);

                if (data.status === 'completed') {
                    // Fetch JSON and Video files once processing is done
                    downloadVideoFile(jobId);
                    downloadJsonFile(jobId);
                    eventSource.close();
                } else if (data.status === 'failed') {
                    console.error('Processing failed.');
                    eventSource.close();  // Close the connection if processing failed
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE error:', error);
                eventSource.close();
            };

            // Clean up the SSE connection on unmount
            return () => {
                eventSource.close();
            };
        }
    }, [jobId]);



    // Cleanup the local video URL when the component unmounts
    useEffect(() => {
        return () => {
            if (localVideoUrl) {
                URL.revokeObjectURL(localVideoUrl);  // Revoke the object URL to release memory
            }
        };
    }, [localVideoUrl]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileSelect} accept="video/mp4" />
                <input type="submit" value="Upload File" />
            </form>

            {processingStatus && <p>Processing Status: {processingStatus}</p>}

            <button onClick={() => { console.log(localVideoUrl); }}>Log Local Video URL</button>
            <button onClick={() => { console.log(facialData); }}>Log Facial Data</button>
        </div>
    );
};

export default VideoUpload;
