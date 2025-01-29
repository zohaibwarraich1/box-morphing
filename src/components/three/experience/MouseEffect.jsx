import * as THREE from "three";
import { easing } from "maath";

const displacement = 2.2; // Max distance to respond
const intensity = 2; // Movement intensity

export const applyMouseEffect = (
  meshRefs,
  pointer,
  camera,
  delta,
  morphedData
) => {
  const cursor = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const oPos = new THREE.Vector3();
  const vec = new THREE.Vector3();

  cursor.set(pointer.x, pointer.y, 0.5).unproject(camera); // Get cursor position in 3D space
  dir.copy(cursor).sub(camera.position).normalize();
  cursor.add(dir.multiplyScalar(camera.position.length()));

  meshRefs.forEach((mesh) => {
    if (!mesh) return;

    // Get the current position of the mesh
    const currentPos = new THREE.Vector3();
    mesh.getWorldPosition(currentPos);

    const dist = currentPos.distanceTo(cursor);

    // Calculate target position
    const targetPos =
      dist > displacement
        ? currentPos // Original position if outside displacement range
        : vec.copy(currentPos).add(
            dir
              .subVectors(currentPos, cursor)
              .normalize()
              .multiplyScalar((displacement - dist) * intensity)
          );

    // Use easing.damp3 for smooth transition
    easing.damp3(mesh.position, targetPos, 0.2, delta);
  });
};
