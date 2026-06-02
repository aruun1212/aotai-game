import { supabase, supabaseReady } from '@/lib/supabase'

export interface LeaderboardEntry {
  nickname: string
  emoji: string
  count: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

let itemsLeftCache: { data: LeaderboardEntry[]; timestamp: number } | null = null
let peopleHelpedCache: { data: LeaderboardEntry[]; timestamp: number } | null = null

/**
 * Fetch "items left" ranking (top 20)
 */
export async function fetchItemsLeftRanking(): Promise<LeaderboardEntry[]> {
  // Check cache
  if (itemsLeftCache && Date.now() - itemsLeftCache.timestamp < CACHE_DURATION) {
    return itemsLeftCache.data
  }

  if (!supabase || !supabaseReady.value) {
    return itemsLeftCache?.data ?? []
  }

  const { data, error } = await supabase
    .from('players')
    .select('nickname, emoji, items_left')
    .gt('items_left', 0)
    .order('items_left', { ascending: false })
    .limit(20)

  if (error) {
    console.warn('[Leaderboard] Items left fetch error:', error.message)
    return itemsLeftCache?.data ?? []
  }

  const result = (data ?? []).map(d => ({
    nickname: d.nickname,
    emoji: d.emoji,
    count: d.items_left,
  }))

  itemsLeftCache = { data: result, timestamp: Date.now() }
  return result
}

/**
 * Fetch "people helped" ranking (top 20)
 */
export async function fetchPeopleHelpedRanking(): Promise<LeaderboardEntry[]> {
  // Check cache
  if (peopleHelpedCache && Date.now() - peopleHelpedCache.timestamp < CACHE_DURATION) {
    return peopleHelpedCache.data
  }

  if (!supabase || !supabaseReady.value) {
    return peopleHelpedCache?.data ?? []
  }

  const { data, error } = await supabase
    .from('players')
    .select('nickname, emoji, people_helped')
    .gt('people_helped', 0)
    .order('people_helped', { ascending: false })
    .limit(20)

  if (error) {
    console.warn('[Leaderboard] People helped fetch error:', error.message)
    return peopleHelpedCache?.data ?? []
  }

  const result = (data ?? []).map(d => ({
    nickname: d.nickname,
    emoji: d.emoji,
    count: d.people_helped,
  }))

  peopleHelpedCache = { data: result, timestamp: Date.now() }
  return result
}

/**
 * Check if we have cached data (for offline indicator)
 */
export function hasCachedData(): boolean {
  return itemsLeftCache !== null || peopleHelpedCache !== null
}
