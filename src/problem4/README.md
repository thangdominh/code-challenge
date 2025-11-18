# Problem 4: Three Ways to Sum to n

## Problem Description

Implement three unique approaches to calculate the sum of integers from 1 to n (inclusive).

**Example:** `sum_to_n(5) = 1 + 2 + 3 + 4 + 5 = 15`

## Implementation Approaches

### 1. Iterative Approach (`sum_to_n_a`)

Uses a simple for loop to accumulate the sum.

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)
- **Pros:** Easy to understand, straightforward implementation
- **Cons:** Linear time complexity
- **Use Case:** General purpose, good for moderate values of n

### 2. Mathematical Formula (`sum_to_n_b`)

Uses Gauss's arithmetic series formula: `n * (n + 1) / 2`

- **Time Complexity:** O(1)
- **Space Complexity:** O(1)
- **Pros:** Instant calculation, most efficient, works for very large n
- **Cons:** None
- **Use Case:** **Recommended for production** - best performance

### 3. Recursive Approach (`sum_to_n_c`)

Uses recursion: `sum(n) = n + sum(n-1)` with base case `sum(1) = 1`

- **Time Complexity:** O(n)
- **Space Complexity:** O(n) - call stack overhead
- **Pros:** Demonstrates recursive thinking
- **Cons:** Stack overflow risk for large n (typically > 10,000), higher memory usage
- **Use Case:** Educational purposes only, not recommended for production

## How to Run

### Prerequisites

- Node.js installed
- TypeScript (via npx or globally installed)

### Running the Code

**Using ts-node (Recommended)**

```bash
npx ts-node sum_to_n.ts
```

## Test Results

The implementation includes test cases for n = 1, 5, 10, 100, and 1000.

Sample output:

```
n = 5:
  Iterative (a): 15
  Formula (b):   15
  Recursive (c): 15
  All match: ✓
```

All three implementations produce identical results, verifying correctness.

## Performance Comparison

For `n = 1,000,000`:

- **Formula (`sum_to_n_b`)**: < 1ms ⚡ (O(1))
- **Iterative (`sum_to_n_a`)**: ~10-20ms (O(n))
- **Recursive (`sum_to_n_c`)**: Stack Overflow ❌ (not suitable)

**Recommendation:** Use `sum_to_n_b` (mathematical formula) for all production scenarios.
