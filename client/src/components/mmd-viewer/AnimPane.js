import { useEffect, useState } from 'react';
import { MMDLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r123/examples/jsm/loaders/MMDLoader.js';

import { useModel } from '../../hooks/useModel.js';
import AnimScene from './AnimScene.js';
import AnimControl from './AnimControl.js';
import { now } from 'three/examples/jsm/libs/tween.module.js';

const AnimPane = () => {
    const {modelObject, setModelObject} = useModel();
    const [width, setWidth] = useState(1);
    const {modelPath, setModelPath} = useModel();
    const [folderName, setFolderName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    
    // TODO: Remove this hardcoded link to file when create server
    var modelFilePath = 'models/kizunaai/kizunaai.pmx'; // temporary static file in /public

    // Model loading progress
    const onProgress = (xhr) => {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    }

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    // Handle folder name input change
    const handleFolderNameChange = (e) => {
        setFolderName(e.target.value);
    };

    // Submit selected files and folder name to the server
    const handleUpload = async () => {
        const uploadIdentifier = Date.now(); // Unique identifier for the upload
        if (!folderName || selectedFiles.length === 0) {
            alert('Please enter a folder name and select files.');
            return;
        }
    
        const formData = new FormData();
        formData.append('folderName', folderName);
        formData.append('uploadIdentifier', uploadIdentifier); // Append the unique identifier
    
        // Append all files to form data
        Array.from(selectedFiles).forEach((file) => {
            formData.append('mmdFiles', file);
        });
    
        try {
            const response = await fetch('/openvtuber/upload-mmd', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                setUploadStatus('Files uploaded successfully');
                trackUploadProgress();
            } else {
                setUploadStatus('Error uploading files');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            setUploadStatus('Upload failed');
        }
    };
    

    // Track upload progress using SSE
    const trackUploadProgress = () => {
        const eventSource = new EventSource('/openvtuber/mmd-events/upload-progress');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setUploadProgress(data.progress);

            if (data.status === 'Upload complete') {
                eventSource.close();
                setUploadStatus('Upload complete');
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            setUploadStatus('Error in upload progress tracking');
        };
    };

    
    useEffect(() => {
        // Load in mesh object
        if (modelPath) {
            const loader = new MMDLoader().load(modelPath, function(object) {
                setModelObject(object);
                // console.log("Loaded model")
            }, onProgress, null);
        }
    }, [modelPath]);

    return (
        <div className='anim-pane'>

            <div>

                
            </div>
            {/* Upload Form */}
            <div className="upload-form">
                <input
                    type="text"
                    placeholder="Enter folder name"
                    value={folderName}
                    onChange={handleFolderNameChange}
                />
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
                <button onClick={handleUpload}>Upload Files</button>
                
                {/* Upload Progress and Status */}
                {uploadProgress > 0 && (
                    <div className="upload-progress">
                        <p>Upload Progress: {uploadProgress}</p>
                    </div>
                )}

                {uploadStatus && (
                    <div className="upload-status">
                        <p>{uploadStatus}</p>
                    </div>
                )}
            </div>

            <AnimScene/>
            <AnimControl/>
        </div>
    );
}
 
export default AnimPane;