import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import Overlay from './Overlay';
import CustomCursor from './CustomCursor';

export default function App() {
  return (
    <div className="w-screen h-screen relative bg-black">
      <CustomCursor />

      <Canvas
        className="absolute inset-0 fixed top-0 left-0"
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>

      <Overlay />
    </div>
  );
}