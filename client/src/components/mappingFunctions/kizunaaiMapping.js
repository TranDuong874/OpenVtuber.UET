var mouth_index = 10;

const mouthMorphing = (mouthHeight, mouthWidth, mouthDiag) => {
    //morphTable = [[morphTarget],[morphTargetValue]]
    var morphTable = [[9,10,11,12,13], // A I U E O 
                      [0, 0, 0, 0, 0]]; // Default value
    morphTable[1][0] = mouthHeight;
    morphTable[1][2] = mouthWidth;
    morphTable[1][3] = mouthDiag;
    
    return morphTable;
}


export const kizunaaiMapping = (modelObject, data) => {
    modelObject.morphTargetInfluences[mouth_index] = 0;
    var angle_const = 3.1415926 / 180;
    const expressionIntensity = 0.2;
    const angles = { ...data.euler_angle };
    const landmarks = { ...data.landmarks };


    var mouthHeight = (landmarks[60][1] - landmarks[62][1]) / (landmarks[53][1] - landmarks[71][1])  - expressionIntensity;
    var mouthWidth = (landmarks[69][0]-landmarks[65][0]) / (landmarks[61][0] - landmarks[52][0]) - expressionIntensity;
    var mouthDiag = (Math.sqrt(Math.pow(landmarks[57][1] - landmarks[66][1], 2) + Math.pow(landmarks[57][0] - landmarks[66][0], 2))) / 
                    (Math.sqrt(Math.pow(landmarks[58][1] - landmarks[64][1], 2) + Math.pow(landmarks[58][0] - landmarks[64][0], 2))) - expressionIntensity;

    console.log("Mouth index" + mouth_index);

    const morphTable = mouthMorphing(mouthHeight, mouthWidth, mouthDiag);
    for (var i = 0; i < morphTable[0].length; i++) {
        modelObject.morphTargetInfluences[morphTable[0][i]] = morphTable[1][i];
    }
    
    const head = modelObject.skeleton.bones[8];
    head.rotation.x = Math.round(angles.x) * angle_const;
    head.rotation.y = Math.round(-angles.y) * angle_const;
    head.rotation.z = Math.round(-angles.z) * angle_const;

}