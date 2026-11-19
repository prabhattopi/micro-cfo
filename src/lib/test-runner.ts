// Standalone test verification for MicroCFO financial formulas
import { calculateFinancials, generateSensitivityMatrix } from "./cfo-math";
import { STUDENT_HUSTLE_PRESETS } from "../data/hustle-presets";

function runTests() {
  console.log("=========================================");
  console.log(" Running MicroCFO Financial Math Engine Tests");
  console.log("=========================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, desc: string) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${desc}`);
    }
  }

  // Test 1: Campus Bakery preset calculation
  const bakery = STUDENT_HUSTLE_PRESETS[0];
  const bRes = calculateFinancials(bakery.defaultInputs);

  // Unit contribution margin = 45 - 14 - (45 * 0.035 + 1.0) = 45 - 14 - 2.575 = 28.425
  assert(Math.abs(bRes.unitContributionMargin - 28.425) < 0.01, "Unit Contribution Margin matches exact corporate formula");
  // Break-even units = ceil(280 / 28.425) = ceil(9.85) = 10 units
  assert(bRes.breakEvenUnits === 10, `Break-even units is exactly 10 (got ${bRes.breakEvenUnits})`);
  assert(bRes.isBreakEvenFeasible === true, "Target 35 units exceeds break-even point of 10 units");
  assert(bRes.monthlyNetProfit > 0, `Monthly net profit is positive (got HK$${bRes.monthlyNetProfit.toFixed(2)})`);
  assert(bRes.realHourlyWage > 0, `Real hourly wage is positive (got HK$${bRes.realHourlyWage.toFixed(2)}/hr)`);

  // Test 2: Insolvent business (Selling price below variable cost)
  const lossInputs = {
    ...bakery.defaultInputs,
    sellingPrice: 10,
    variableCostPerUnit: 15, // Cost > Price
  };
  const lossRes = calculateFinancials(lossInputs);
  assert(lossRes.unitContributionMargin < 0, "Correctly identifies negative unit contribution margin");
  assert(!isFinite(lossRes.breakEvenUnits), "Break-even units is Infinity when unit margin is negative");
  assert(lossRes.riskFlags.some((f) => f.includes("Negative Unit Margin")), "Flags 'Negative Unit Margin' risk warning");
  assert(lossRes.grade === "F", `Insolvent business receives an 'F' grade (got ${lossRes.grade})`);

  // Test 3: Sensitivity Matrix calculation
  const matrix = generateSensitivityMatrix(bakery.defaultInputs);
  assert(matrix.length === 5, `Sensitivity matrix generates 5 scenario rows (-20%, -10%, 0%, +10%, +20%)`);
  assert(matrix[4].netProfit > matrix[0].netProfit, "Higher price scenario yields higher net profit");

  console.log(`\nResults: ${passed}/${total} tests passed.\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
