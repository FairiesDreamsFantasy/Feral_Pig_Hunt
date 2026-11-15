/**
 * System/Engine/Languages/PHP Module
 * PHP core visual script bindings and web reporting formats.
 */

export const PHP_BINDING = {
  header: '<?php // Feral Pig Hunt - Core Engine Reporting System',
  classDef: `class PigTelemetry {
    public $pigId;
    public $speed;
    public function __construct($id, $s) {
        $this->pigId = $id;
        $this->speed = $s;
    }
  }`
};

export default PHP_BINDING;
