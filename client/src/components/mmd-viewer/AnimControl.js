import { useEffect, useState } from "react";
import { useModel } from "../../hooks/useModel";
import '../../css/App.css'
import SkeletonControl from "./SkeletonControl";
import MorphControl from "./MorphControl";

const AnimControl = () => {
    const {modelObject, setModelObject} = useModel();
    const [controlmode, setControlMode] = useState('skeleton');

    useEffect(() => {
        console.log(modelObject);
    }, [modelObject]);

    if (!modelObject) {
        return <div>No model found</div>
    }

    return (
        <div>
            <div className="controlselection">
                <button onClick={() => setControlMode('skeleton')}>Skeleton control</button>
                <button onClick={() => setControlMode('morph')}>Morph control</button>
            </div>

            {controlmode=='skeleton' && <SkeletonControl></SkeletonControl>}
            {controlmode== 'morph' && <MorphControl></MorphControl>}
        </div>
    );
}
 
export default AnimControl;