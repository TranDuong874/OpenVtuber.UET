import { useState, useEffect } from "react";
import axios from 'axios';
import {useFacialData} from '../../hooks/useFacialData';

const VideoUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobId, setJobId] = useState(null);
    const { facialData, setFacialData } = useFacialData();
    const [processingStatus, setProcessingStatus] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
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

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        if (jobId) {
            const eventSource = new EventSource(`http://localhost:4000/openvtuber/events/${jobId}`);
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setProcessingStatus(data.status);
                if (data.status === 'completed') {
                    // Fetch the JSON data once processing is done
                    axios.get(`http://localhost:4000/openvtuber/download/${jobId}`)
                        .then(response => {
                            setFacialData(response.data);
                            eventSource.close(); // Close the SSE connection
                        })
                        .catch(error => console.error('Error downloading JSON:', error));
                } else if (data.status === 'failed') {
                    eventSource.close(); // Close the SSE connection if processing failed
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE error:', error);
                eventSource.close();
            };

            return () => {
                eventSource.close(); // Clean up the SSE connection when the component unmounts
            };
        }
    }, [jobId]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileSelect} />
                <input type="submit" value="Upload File" />
            </form>
            {processingStatus && <p>Processing Status: {processingStatus}</p>}
            <button onClick={() => {console.log(facialData)}}>Log Facial Data</button>
        </div>
    );
};

export default VideoUpload;
