import { useEffect, useState, useRef } from "react";
import '../../css/App.css'
import { useModel } from "../../hooks/useModel";
import { kizunaaiMapping } from "../mappingFunctions/kizunaaiMapping";

const InputControl = () => {
    const [data, setData] = useState(null);
    const [frameNumber, setFrameNumber] = useState(0);
    const [frame, setFrame] = useState(null);
    const [playing, setPlaying] = useState(false);
    const {modelObject, setModelObject} = useModel();
    const intervalIdRef = useRef(null); // Use a ref to store the interval ID

    
    const playVideo = () => {
        if (intervalIdRef.current !== null) return; // Prevent multiple intervals
        
        intervalIdRef.current = setInterval(() => {
            setFrameNumber((prevFrame) => {
                if (prevFrame < data.frame_count - 1) {
                    const newFrame = prevFrame + 1;
                    handleFrameChange(newFrame); // Update frame and slider
                    kizunaaiMapping(modelObject, data[newFrame]);
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
        setFrameNumber(newFrameNumber);
        setFrame(data[newFrameNumber]);
        console.log(frame);
    };

    const getData = () => {
        fetch("./facial_data.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setFrame(data[frameNumber]);
            })
            .catch((e) => {
                console.log(e.message);
            });
    };

    useEffect(() => {
        getData();
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="input-control">
            CONTROL HERE
            <button onClick={() => console.log(data)}>Log model data</button>
            
            <button onClick={playing ? stopVideo : playVideo}>
                {playing ? "Stop Video" : "Play Video"}
            </button>

            <input
                type="range"
                min="0"
                max={data.frame_count - 1}
                onChange={(e) => handleFrameChange(Number(e.target.value))}
                value={frameNumber} // Sync slider with frameNumber
            />
            {frameNumber}

            <div className="landmark-selection">
                {data && Object.entries(data.landmark_index).map(([index, value]) => (
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
