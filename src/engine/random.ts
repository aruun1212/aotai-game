/**
 * 可重放种子随机数生成器 (mulberry32)
 * 同一个种子，同样的调用序列 = 同样的结果
 */

/** 创建一个 mulberry32 PRNG 实例 */
export function createRng(seed: number) {
  let s = seed | 0

  /** 返回 [0, 1) 的浮点数 */
  function next(): number {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  /** 返回 [min, max] 的整数 */
  function nextInt(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min
  }

  /** 按概率返回 true */
  function chance(probability: number): boolean {
    return next() < probability
  }

  /** 从加权列表中选择一项 */
  function weightedChoice<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let roll = next() * totalWeight
    for (let i = 0; i < items.length; i++) {
      roll -= weights[i]
      if (roll <= 0) return items[i]
    }
    return items[items.length - 1]
  }

  /** 从数组中随机选一个 */
  function pick<T>(arr: T[]): T {
    return arr[nextInt(0, arr.length - 1)]
  }

  /** 洗牌（Fisher-Yates） */
  function shuffle<T>(arr: T[]): T[] {
    const result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = nextInt(0, i)
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  return { next, nextInt, chance, weightedChoice, pick, shuffle }
}

export type Rng = ReturnType<typeof createRng>

/** 生成随机种子 */
export function generateSeed(): number {
  return Math.floor(Math.random() * 2147483647)
}
