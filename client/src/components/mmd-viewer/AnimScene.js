import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r123/build/three.module.js';
import { OutlineEffect } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r123/examples/jsm/effects/OutlineEffect.js';
import { useModel } from '../../hooks/useModel';
import { useEffect, useRef, useState } from 'react';
import '../../css/App.css';

var scene, camera, renderer, effect;

const AnimScene = () => {
    const {modelObject} = useModel();
    const refContainer = useRef(null);

    const onWindowResize = () => {
        const parentWidth = refContainer.current.clientWidth;
        const parentHeight = refContainer.current.clientHeight;
    
        camera.aspect = parentWidth / parentHeight;
        camera.updateProjectionMatrix();
        effect.setSize(parentWidth, parentHeight);
    };

    // Initialize scene and 3D model
    useEffect(() => {
        const parentWidth = refContainer.current.clientWidth;
        const parentHeight = refContainer.current.clientHeight;

        //  Camera
        camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(0, 0, 16);

        //  Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        //  Lighting
        var ambient = new THREE.AmbientLight(0x666666);
        scene.add(ambient);

        var directionalLight = new THREE.DirectionalLight(0x887766);
        directionalLight.position.set(- 1, 1, 1).normalize();
        scene.add(directionalLight);

        //  Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(parentWidth, parentHeight);

        //  Window resizing
		window.addEventListener('resize', onWindowResize, false);
        
        //  Adding canvas component to <div>
        refContainer.current && refContainer.current.appendChild(renderer.domElement);

        //  Initial render with default scene configuration
        effect = new OutlineEffect(renderer);

        scene.add(modelObject)
        camera.position.z = 20;
        camera.position.y = 18;

        var animate = function () {
            requestAnimationFrame(animate);
            effect.render(scene, camera);
        };

        animate(); 

        return () => {
            renderer.dispose();
            refContainer.current.removeChild(renderer.domElement);
        };
    },[modelObject]) // Reload whole scene upon model change

    return (
        <div className='scene' ref={refContainer}>
            
        </div>
    );
}




 
export default AnimScene;