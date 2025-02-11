import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";

const MovingCamel= () => {
    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01; // 매 프레임마다 y축으로 회전
        }
    });

        return (
                <mesh ref={meshRef}>
                    <boxGeometry args={[1, 1, 1]}/>
                    <meshStandardMaterial color="hotpink"/>
                </mesh>
        );
}

export default MovingCamel;