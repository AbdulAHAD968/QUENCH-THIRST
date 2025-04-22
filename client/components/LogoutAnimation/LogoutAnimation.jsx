import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import "./LogoutAnimation.css";

const LogoutAnimation = () => {
  const navigate = useNavigate();
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, Math.PI * 0.5);
    light.position.setScalar(1);
    scene.add(light, new THREE.AmbientLight(0xffffff, Math.PI * 0.25));

    // Load HDR Environment
    new RGBELoader()
      .setPath("https://threejs.org/examples/textures/equirectangular/")
      .load("royal_esplanade_1k.hdr", (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
      });

    // Head Model
    class Head extends THREE.Object3D {
      constructor() {
        super();

        // Head
        let head = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1, 5),
          new THREE.MeshStandardMaterial({ color: "orange", roughness: 0.4, metalness: 0.9 })
        );
        this.add(head);

        // Ears
        let earBase = new THREE.CylinderGeometry(0.35, 0.35, 0.1).rotateX(Math.PI * 0.5).translate(0, 0, 0.95);
        let earsG = mergeGeometries([
          earBase.clone().lookAt(new THREE.Vector3().setFromSphericalCoords(1, Math.PI / 2.5, Math.PI * 0.5)),
          earBase.clone().lookAt(new THREE.Vector3().setFromSphericalCoords(1, Math.PI / 2.5, Math.PI * -0.5)),
          new THREE.TorusGeometry(1, 0.05, 8, 60).translate(0, 0.6, 0)
        ]);
        let ears = new THREE.Mesh(earsG, new THREE.MeshStandardMaterial({ color: "silver", metalness: 0.9, roughness: 0.6 }));
        this.add(ears);

        // Eyes
        let eyeBase = new THREE.LatheGeometry(
          new THREE.Path()
            .moveTo(0, 0)
            .lineTo(0.25, 0)
            .absarc(0.25, 0.025, 0.025, Math.PI * 1.5, Math.PI * 2.5)
            .absarc(0, 0.05, 0.05, 0, Math.PI * 0.5)
            .getPoints(50),
          30
        ).rotateX(Math.PI * 0.5).translate(0, 0, 0.95);
        let eyesG = mergeGeometries([
          eyeBase.clone().lookAt(new THREE.Vector3().setFromSphericalCoords(1, Math.PI / 3, Math.PI * 0.125)),
          eyeBase.clone().lookAt(new THREE.Vector3().setFromSphericalCoords(1, Math.PI / 3, Math.PI * -0.125))
        ]);
        let eyes = new THREE.Mesh(eyesG, new THREE.MeshStandardMaterial({ color: "red", roughness: 0.4, metalness: 0.9 }));
        this.add(eyes);

        // Nose
        let nose = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.3)
            .translate(0, 0.15, 0)
            .rotateX(Math.PI * 0.5)
            .translate(0, 0, 0.95)
            .lookAt(new THREE.Vector3().setFromSphericalCoords(1, Math.PI / 2.125, 0)),
          new THREE.MeshStandardMaterial({ color: "gray", metalness: 0.9, roughness: 0.6 })
        );
        this.add(nose);

        // Lips/Teeth
        let rMain = Math.sqrt(1 - 0.8 ** 2);
        let r = 0.05;
        let angle = Math.PI / 1.5;
        let lipsG = mergeGeometries([
          new THREE.TorusGeometry(rMain, r, 16, 30, angle),
          new THREE.SphereGeometry(r, 16, 8, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5).translate(rMain, 0, 0),
          new THREE.SphereGeometry(r, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5).translate(rMain, 0, 0).rotateZ(angle)
        ]).translate(0, 0, 0.8).rotateZ((-Math.PI - angle * 0.75) * 0.5);
        let lips = new THREE.Mesh(lipsG, new THREE.MeshStandardMaterial({ metalness: 0.9, roughness: 0.4 }));
        this.add(lips);

        // Hair
        let hair = new THREE.Mesh(
          new THREE.TorusKnotGeometry(0.35, 0.25, 200, 36, 5, 4).scale(0.75, 0.75, 0.75).rotateX(Math.PI * 0.5).translate(0, 1, 0),
          new THREE.MeshStandardMaterial({ color: 0x00ff88, roughness: 0.4, metalness: 0.9 })
        );
        this.add(hair);

        // Neck
        let neck = new THREE.Mesh(
          new THREE.LatheGeometry(
            [
              [0, 0],
              [0.2, 0],
              [0.2, 0.5],
              [0.9, 0.6],
              [0.9, 0.65],
              [0.2, 0.75],
              [0.2, 1],
              [0, 1]
            ].map(p => { return [new THREE.Vector2(...p), new THREE.Vector2(...p)]; }).flat(),
            72
          ).translate(0, -1.95, 0),
          new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.4 })
        );
        this.add(neck);
      }
    }

    // Add Head
    let head = new Head();
    scene.add(head);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      head.rotation.y += 0.02;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Redirect to login after 5 seconds
    const timeout = setTimeout(() => {
      navigate("/auth");
    }, 5000);

    // Cleanup
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [navigate]);

  return (
    <div className="logout-animation">
        {/* LOGGING OUT WITHIN LINE STYLE */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <h1>Logging Out...</h1>
        </div>
        <div ref={mountRef}></div>
    </div>
  );
};

export default LogoutAnimation;