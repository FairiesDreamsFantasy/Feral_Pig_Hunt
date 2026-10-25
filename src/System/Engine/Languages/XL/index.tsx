/**
 * System/Engine/Languages/XL Module
 * Excel-based layouts (A1, B1 cells, formulas, spreadsheets) representing pig coordinates and physics values.
 */

export const XL_BINDING = {
  headerCells: ['A1: Time', 'B1: Pig ID', 'C1: Velocity X', 'D1: Velocity Y', 'E1: Tusk Length', 'F1: Final Score'],
  scoreFormula: '=SUM(C2*D2) + (E2*1.5) ; Excel cell score multiplier formula',
};

export default XL_BINDING;
