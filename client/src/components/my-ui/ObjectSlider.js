// ObjectSlider.js
import React, { useEffect, useState } from 'react';

const ObjectSlider = ({ object, attribute, name, min, max, step=0.1}) => {

  const handleChange = (e) => {
    object[attribute] = parseFloat(e.target.value);
    setValue(object[attribute]);
  };

  useEffect(() => {
    setValue(object[attribute])
  }, [object]);
  
  const [value, setValue] = useState(object[attribute]);

  return (
    <div>
        {name && <label>{name}</label>}
        {!name&& <label>{attribute}</label>}
        <input value={value} type="range" min={min} max={max} step={step} onChange={handleChange}/>
        <input value={value} type='number' min={min} max={max} onChange={handleChange}></input>
    </div>

  );
};

export default ObjectSlider;
