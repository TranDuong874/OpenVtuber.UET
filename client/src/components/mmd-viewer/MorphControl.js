import { useEffect, useState } from "react";
import { useModel } from "../../hooks/useModel";
import ObjectSlider from "../my-ui/ObjectSlider";

const MorphControl = () => {
    const {modelObject, setModelObject} = useModel();
    const [currentMorphInfo, setCurrentMorphInfo] = useState(null);
    const [currentMorph, setCurrentMorph] = useState(null);

    const handleMorphSelect = (index, name) => {
        
        setCurrentMorphInfo({index, name});
        setCurrentMorph(modelObject.morphTargetInfluences);
    }

    return (
        <div className="morph">
            <div className="morph-selection">
                {modelObject && Object.entries(modelObject.morphTargetDictionary).map(([name, index]) => (
                    <div>
                        <button onClick={() => handleMorphSelect(index, name)}>{index}.{name}</button>
                    </div>
                ))}
            </div>

            {currentMorphInfo && <div className="morph-control">
                <div className="morph-name">
                    {currentMorphInfo.index}.{currentMorphInfo.name}
                </div>
                <ObjectSlider
                    object={currentMorph}
                    attribute={currentMorphInfo.index}
                    name={" "}
                    min="-1"
                    max="1"
                />
            </div>}
            {!currentMorphInfo && <div className="morph-control"><p>Morph control</p></div>}
        </div>
    );
}
 
export default MorphControl;