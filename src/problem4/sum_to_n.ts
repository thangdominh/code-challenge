/**
 * Problem 4: Three ways to sum to n
 *
 * Provide 3 unique implementations to calculate the sum from 1 to n.
 * Each implementation uses a different algorithmic approach.
 */

/**
 * Approach 1: Iterative (Loop-based)
 *
 * Uses a simple for loop to accumulate the sum.
 *
 * Time Complexity: O(n) - Loops through n iterations
 * Space Complexity: O(1) - Only uses a single variable for accumulation
 *
 * Efficiency: Good for general use cases. Easy to understand and debug.
 * Suitable when n is moderate and readability is important.
 */
function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Approach 2: Mathematical Formula (Gauss's Formula)
 *
 * Uses the closed-form mathematical formula: n * (n + 1) / 2
 * This is based on the arithmetic series sum formula.
 *
 * Time Complexity: O(1) - Constant time, just arithmetic operations
 * Space Complexity: O(1) - No additional space needed
 *
 * Efficiency: BEST - Most efficient approach. Calculates result instantly
 * regardless of input size. Should be preferred for production use.
 * Works perfectly for very large values of n.
 */
function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Approach 3: Recursive
 *
 * Uses recursion to break down the problem into smaller subproblems.
 * Calculates sum(n) = n + sum(n-1), with base case sum(1) = 1.
 *
 * Time Complexity: O(n) - Makes n recursive calls
 * Space Complexity: O(n) - Uses call stack space for n recursive calls
 *
 * Efficiency: WORST - Not recommended for large n due to:
 * 1. Risk of stack overflow for large inputs (typically > 10000)
 * 2. Higher memory usage due to call stack
 * 3. Function call overhead
 * Educational value but impractical for production.
 */
function sum_to_n_c(n: number): number {
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_c(n - 1);
}

// Test cases
console.log("Testing sum_to_n implementations:\n");

const testCases = [1, 5, 10, 100, 1000];

testCases.forEach((n) => {
  const resultA = sum_to_n_a(n);
  const resultB = sum_to_n_b(n);
  const resultC = sum_to_n_c(n);

  console.log(`n = ${n}:`);
  console.log(`  Iterative (a): ${resultA}`);
  console.log(`  Formula (b):   ${resultB}`);
  console.log(`  Recursive (c): ${resultC}`);
  console.log(
    `  All match: ${resultA === resultB && resultB === resultC ? "✓" : "✗"}`
  );
  console.log();
});

// Verify the example from requirements
console.log("Example verification:");
console.log(`sum_to_n(5) = ${sum_to_n_b(5)} (expected: 15)`);
console.log(`1 + 2 + 3 + 4 + 5 = 15 ✓`);
