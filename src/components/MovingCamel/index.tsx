import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Object3D } from "three";

type Props = {
    x? : number;
    y? : number;
    z? : number;
}

const MovingCamel = ({x=0,y=-1,z=0} : Props) => {
    const meshRef = useRef<Object3D | null>(null);
    const { scene } = useGLTF("/img/glb/camel.glb"); // 낙타 3D 모델 로드

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.03; // y축으로 회전
        }
    });

    return <primitive ref={meshRef} object={scene} scale={1} position={[x, y, z]}/>;
};

export default MovingCamel;
