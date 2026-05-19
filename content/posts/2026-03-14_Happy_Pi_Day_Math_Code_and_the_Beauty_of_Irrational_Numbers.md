---
title: "Happy Pi Day: Math, Code, and the Beauty of Irrational Numbers"
date: 2026-03-14
tags: ['Math', 'Fun', 'Python', 'Pi Day', 'Programming']
---

# Happy Pi Day: Math, Code, and the Beauty of Irrational Numbers

March 14th (3/14) is Pi Day. In honor of the most famous irrational number, let's celebrate the intersection of math and code.

## Computing Pi in Different Ways

### Method 1: Leibniz Formula (Slow but Beautiful)

```python
def leibniz_pi(iterations: int) -> float:
    '''
    π/4 = 1 - 1/3 + 1/5 - 1/7 + ...
    Converges incredibly slowly. Needs millions of terms.
    Beautiful mathematics though.
    '''
    result = 0
    for i in range(iterations):
        result += (-1)**i / (2*i + 1)
    return result * 4

print(leibniz_pi(1_000_000))  # ~3.14159165...
```

### Method 2: Monte Carlo Simulation

```python
import random

def monte_carlo_pi(points: int) -> float:
    '''
    Throw random darts at a unit square.
    Count how many land inside the quarter circle.
    Ratio = pi/4
    '''
    inside = 0
    for _ in range(points):
        x, y = random.random(), random.random()
        if x**2 + y**2 <= 1:
            inside += 1
    return 4 * inside / points

print(monte_carlo_pi(1_000_000))  # ~3.1415...
```

### Method 3: Machin's Formula (Fast)

```python
from decimal import Decimal, getcontext

def machin_pi(precision: int) -> Decimal:
    '''
    pi/4 = 4·arctan(1/5) - arctan(1/239)
    Converges much faster than Leibniz.
    Used to compute pi to millions of digits historically.
    '''
    getcontext().prec = precision + 10
    
    def arctan(x: Decimal, terms: int) -> Decimal:
        result = x
        x_sq = x * x
        term = x
        for i in range(1, terms):
            term = -term * x_sq
            result += term / Decimal(2 * i + 1)
        return result
    
    pi = 4 * (4 * arctan(Decimal(1)/5, 100) - arctan(Decimal(1)/239, 100))
    return +pi

getcontext().prec = 50
print(machin_pi(50))
```

## Pi Facts That Break Developer Brains

- Pi contains every finite sequence of digits somewhere in it (probably)
- The digits of Pi pass every statistical test for randomness
- Your birthday is in pi: `3.14159265...{your_birthday}...`
- NASA uses pi to only 15 decimal places for spacecraft navigation
- The circumference of the observable universe can be calculated with only 40 digits of pi

## The Programmer's Pi

```python
# Quick ways to get pi in your code:
import math
print(math.pi)  # 3.141592653589793

# Via numpy
import numpy as np
print(np.pi)  # 3.141592653589793

# Or just:
π = 3.14159265358979323846  # Copy it. You have enough precision.
```

## Happy Pi Day

3.14159265358979323846264338327950288...

This number is infinite, non-repeating, and somehow describes circles. Math is wild. Happy Pi Day.

Now go compute something beautiful. 🥧

