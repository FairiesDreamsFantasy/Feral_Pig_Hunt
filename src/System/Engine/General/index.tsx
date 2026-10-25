import { ARCADE_SETTINGS, BoundingBox } from '../../General/index.tsx';
export * from '../Science/Physics/General/index.tsx';
import { verifyAABBCollision, Vector2DCalculus, VelocityVerletIntegrator, RigidBodyDynamics, LotkaVolterraEcology } from '../Science/Physics/General/index.tsx';

export function checkAABBCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return verifyAABBCollision(box1, box2);
}

export const EngineGeneral = {
  tickRate: 60,
  settings: ARCADE_SETTINGS,
  checkAABBCollision,
  Vector2DCalculus,
  VelocityVerletIntegrator,
  RigidBodyDynamics,
  LotkaVolterraEcology,
};

export default EngineGeneral;
