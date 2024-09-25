import { useState, useRef, useEffect } from "react";
import '../../css/App.css'
import { useModel } from "../../hooks/useModel";
import { kizunaaiMapping } from "../mappingFunctions/kizunaaiMapping";
import { useFacialData } from "../../hooks/useFacialData";
import { useLocalVideo} from "../../hooks/useLocalVideoProvider";

const InputControl = () => {
    const {videoFrame, setVideoFrame} = useLocalVideo();
    const {facialData} = useFacialData();
    const [frame, setFrame] = useState(null);
    const [playing, setPlaying] = useState(false);
    const {modelObject} = useModel();
    const [disableControl, setDisableControl] = useState(false);
    const intervalIdRef = useRef(null); // Use a ref to store the interval ID
    
    const playVideo = () => {
        if (intervalIdRef.current !== null) return; // Prevent multiple intervals
        
        intervalIdRef.current = setInterval(() => {
            setVideoFrame((prevFrame) => {
                if (prevFrame < facialData.frame_count - 1) {
                    const newFrame = prevFrame + 1;
                    handleFrameChange(newFrame); // Update frame and slider
                    kizunaaiMapping(modelObject, facialData[newFrame]);
                    return newFrame;
                } else {
                    clearInterval(intervalIdRef.current); // Stop when max frame is reached
                    intervalIdRef.current = null;
                    setPlaying(false);
                    return prevFrame;
                }
            });
        }, 1000/25);
        setPlaying(true);
    };

    const stopVideo = () => {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
            setPlaying(false);
        }
    };

    const handleFrameChange = (newFrameNumber) => {
        setVideoFrame(newFrameNumber);
        kizunaaiMapping(modelObject, facialData[newFrameNumber]);
        setFrame(facialData[newFrameNumber]);
        console.log(frame);
    };

    useEffect(() => {
        if (facialData) {
            setDisableControl(false);
        } else {
            setDisableControl(true);
        }

    }, [facialData]);

    return (
        <div className="input-control">
            <button disabled={disableControl} onClick={playing ? stopVideo : playVideo}>
                {playing ? "Stop Video" : "Play Video"}
            </button>

            {facialData && (<input
                type="range"
                min="0"
                max={facialData.frame_count - 1}
                onChange={(e) => handleFrameChange(Number(e.target.value))}
                value={videoFrame} // Sync slider with frameNumber
            />)}
            {facialData && videoFrame}
            <div className="landmark-selection">
                {facialData && Object.entries(facialData.landmark_index).map(([index, value]) => (
                    <div key={index}>
                        <button className="landmark-button">{value}</button>
                        <button>
                            <span>X coord: {frame?.landmarks[value]?.[0]}</span>
                            <span>Y coord: {frame?.landmarks[value]?.[1]}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InputControl;
