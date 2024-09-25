import { useEffect, useState } from 'react';
import { useModel } from '../../hooks/useModel';
const ModelFileTree = () => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {modelPath, setModelPath} = useModel();

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch('/openvtuber/folders'); // Adjust the endpoint based on your setup
                if (!response.ok) {
                    throw new Error('Failed to fetch folders');
                }
                const data = await response.json();
                setFolders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFolders();
    }, []);

    const handleFolderClick = (folderName) => {
        // Logic to navigate to the folder or do something with it
        setModelPath('/openvtuber/' + folderName + '/kizunaai.pmx');
        console.log('/openvtuber/' + folderName + '/kiznuaai.pmx')
        // window.location.href = `/openvtuber/uploads/MMDs/${folderName}`; // Adjust as needed
    };

    return (
        <div className="model-file-tree">
            <h3>Uploaded Models</h3>
            {loading && <p>Loading folders...</p>}
            {error && <p className="error">{error}</p>}
            <div className="uploaded-model-list">
                {folders.map(folder => (
                    <div 
                        key={folder} 
                        className="folder-item" 
                        onClick={() => handleFolderClick(folder)} 
                        style={{ cursor: 'pointer', padding: '5px', border: '1px solid #ccc', margin: '5px 0' }}
                    >
                        {folder}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelFileTree;
