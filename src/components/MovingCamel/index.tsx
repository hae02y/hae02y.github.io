import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const MovingCamel = () => {
    const meshRef = useRef();
    const { scene } = useGLTF("/img/glb/camel.glb"); // 낙타 3D 모델 로드

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.03; // y축으로 회전
        }
    });

    return <primitive ref={meshRef} object={scene} scale={1} position={[0,-1,0]}/>;
};

export default MovingCamel;
