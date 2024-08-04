import { useModel } from "../../hooks/useModel";
import { useState } from "react";
// import { GUI } from "dat.gui";
import { useRef } from "react";
import ObjectSlider from "../my-ui/ObjectSlider";

const SkeletonControl = () => {
    const [currentBone, setCurrentBone] = useState(null);
    const {modelObject, setModelObject} = useModel();
    
    const handleBoneSelect = (bone) => {
        setCurrentBone(bone);
    }
    
    return (
        <div className="skeleton">
            <div className="bone-selection">
                {modelObject && Object.entries(modelObject.skeleton.bones).map(([index, bone])=>(
                    <div className="bone" key={bone.uuid}>
                        <button onClick={() => handleBoneSelect(bone)}>
                            {index}.{bone.name}
                        </button>
                    </div>
                ))}
            </div>
            
            {currentBone && <div className="bone-control">
                <p>Bone control</p>
                <div className="bone-name">
                    {currentBone.name}
                </div>
                    
                <div className="parent"></div>
                <div className="children"></div>
                <div className="position">
                    Position
                    <ObjectSlider object={currentBone.position} attribute="x" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.position} attribute="y" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.position} attribute="z" min ="-50" max="50"></ObjectSlider>
                </div>
                <div className="quaternion">
                    Quaternion
                    <ObjectSlider object={currentBone.quaternion} attribute="_x" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.quaternion} attribute="_y" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.quaternion} attribute="_z" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.quaternion} attribute="_w" min ="-50" max="50"></ObjectSlider>
                </div>
                <div className="rotation">
                    Rotation
                    <ObjectSlider object={currentBone.rotation} attribute="x" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.rotation} attribute="y" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.rotation} attribute="z" min ="-50" max="50"></ObjectSlider>
                </div>
                <div className="scale">
                    Scale
                    <ObjectSlider object={currentBone.scale} attribute="x" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.scale} attribute="y" min ="-50" max="50"></ObjectSlider>
                    <ObjectSlider object={currentBone.scale} attribute="z" min ="-50" max="50"></ObjectSlider>
                </div>
                <div className="visible"></div>
            </div>}

            {!currentBone && <div className="bone-control"><p>Bone control</p></div>}
        </div>
    );
}
 
export default SkeletonControl;