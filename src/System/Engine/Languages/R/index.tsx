/**
 * System/Engine/Languages/R Module
 * R language statistical plots, regression modeling parameters, and pig weight distribution curves.
 */

export const R_BINDING = {
  regressionFormula: 'fit <- lm(Score ~ TuskLength + HuntDuration, data = pig_hunts)',
  plotCode: 'plot(pig_hunts$TuskLength, pig_hunts$Score, main="Feral Pig Score Regression")'
};

export default R_BINDING;
