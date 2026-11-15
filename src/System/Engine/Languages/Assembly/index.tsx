/**
 * System/Engine/Languages/Assembly Module
 * Core low-level language definitions for System/Engine.
 * Contains direct transpilation maps for C, C++, C#, and WebAssembly (WASM).
 */

export const Assembly_x86_64 = {
  header: '; Feral Pig Hunt - Core Engine x86_64 Assembly Map',
  registers: {
    rax: '0x00000000', // Accumulator (Return values)
    rdi: '0x00000000', // First argument
    rsi: '0x00000000', // Second argument
  },
  instructions: {
    mov: 'mov rax, rdi',
    add: 'add rax, rsi',
    ret: 'ret',
  }
};

export const C = {
  header: '/* Feral Pig Hunt - Core Engine C Bindings */',
  types: 'typedef struct { double x; double y; double vx; double vy; } PigState;',
  functions: {
    update: 'void update_pig(PigState* pig, double dt) { pig->x += pig->vx * dt; pig->y += pig->vy * dt; }'
  }
};

export const CPP = {
  header: '// Feral Pig Hunt - Core Engine C++ Bindings',
  classDef: 'class Pig { public: double x, y, vx, vy; void update(double dt) { x += vx * dt; y += vy * dt; } };'
};

export const CSharp = {
  header: '// Feral Pig Hunt - Core Engine C# .NET Bindings',
  namespace: 'namespace FeralPig { public class Pig { public double X { get; set; } public void Update(double dt) {} } }'
};

export const Web_Assembly = {
  header: ';; Feral Pig Hunt - WASM Web Assembly Bindings',
  watCode: '(module (func $update (param $x f64) (param $vx f64) (result f64) (f64.add (local.get $x) (local.get $vx))))'
};

export default {
  Assembly_x86_64,
  C,
  CPP,
  CSharp,
  Web_Assembly,
};
