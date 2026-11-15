/**
 * System/Engine/Languages/index.tsx
 * Master export index for all language bindings configured in System/Engine.
 */

import AssemblyModule from './Assembly/index.tsx';
import BasicModule from './Basic/index.tsx';
import XMLModule from './XML/index.tsx';
import CSVModule from './CSV/index.tsx';
import PHPModule from './PHP/index.tsx';
import SQLModule from './SQL/index.tsx';
import RustModule from './Rust/index.tsx';
import RModule from './R/index.tsx';
import GOModule from './GO/index.tsx';
import KotlinModule from './Cotlin/index.tsx';
import SwiftModule from './Swift/index.tsx';
import ThreeJSModule from './3-DJS/index.tsx';
import ExcelModule from './XL/index.tsx';

export const Assembly = AssemblyModule;
export const Basic = BasicModule;
export const XML = XMLModule;
export const CSV = CSVModule;
export const PHP = PHPModule;
export const SQL = SQLModule;
export const Rust = RustModule;
export const R = RModule;
export const GO = GOModule;
export const Cotlin = KotlinModule;
export const Swift = SwiftModule;
export const ThreeDJS = ThreeJSModule;
export const XL = ExcelModule;

export default {
  Assembly,
  Basic,
  XML,
  CSV,
  PHP,
  SQL,
  Rust,
  R,
  GO,
  Cotlin,
  Swift,
  ThreeDJS,
  XL,
};
