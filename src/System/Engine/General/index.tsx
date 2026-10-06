import { ARCADE_SETTINGS, BoundingBox } from '../../General/index.tsx';

export function checkAABBCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
}

export const EngineGeneral = { tickRate: 60, settings: ARCADE_SETTINGS, checkAABBCollision };
export default EngineGeneral;
