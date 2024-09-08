export const kizunaaiMapping = (modelObject, data) => {
    var angle_const = 3.1415926 / 180;

    const angles = {...data.euler_angle};


    const head = modelObject.skeleton.bones[8];
    head.rotation.x = Math.round(angles.x) * angle_const;
    head.rotation.y = Math.round(angles.y) * angle_const;
    head.rotation.z = Math.round(angles.z) * angle_const;

}