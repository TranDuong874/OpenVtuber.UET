
import { useEffect, useState } from 'react';
import { MMDLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r123/examples/jsm/loaders/MMDLoader.js';

import { useModel } from '../../hooks/useModel.js';
import AnimScene from './AnimScene.js';
import AnimControl from './AnimControl.js';

const onProgress = (xhr) => {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
}

//1. Load model
//2. Draw scene
//3. Add model to scene scene.add(modelObject)
//4. Add model control panel

{/* <body>
    <div>
        THREE.JS renderer
    </div>
</body> */}

const AnimPane = () => {
    const {modelObject, setModelObject} = useModel();
    const [width, setWidth] = useState(1);
    
    // TODO: Remove this hardcoded link to file when create server
    var modelFilePath = 'models/kizunaai/kizunaai.pmx'; // temporary static file in /public

    
    useEffect(() => {
        // Load in mesh object
        const loader = new MMDLoader().load(modelFilePath, function(object) {
            setModelObject(object);
            // console.log("Loaded model")
        }, onProgress, null);
    }, [])

    if (!modelObject) {
        return <div>Loading 3D model...</div>
    }

    return (
        <div className='anim-pane'>
            <AnimScene/>
            <AnimControl/>
        </div>
    );
}
 
export default AnimPane;