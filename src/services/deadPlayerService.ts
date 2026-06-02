import { supabase, supabaseReady } from '@/lib/supabase'

export interface DeadPlayer {
  id: number
  player_id: string
  nickname: string
  emoji: string
  segment_id: number
  grid_position: number
  death_cause: string | null
  death_narrative: string | null
  discovered_by: string | null
  brought_out: boolean
  created_at: string
}

/**
 * Record a death (create "bad save" on the mountain)
 */
export async function recordDeath(
  playerId: string,
  nickname: string,
  emoji: string,
  segmentId: number,
  gridPosition: number,
  deathCause: string | null,
  deathNarrative: string | null,
): Promise<boolean> {
  if (!supabase || !supabaseReady.value) return false

  const { error } = await supabase.from('dead_players').insert({
    player_id: playerId,
    nickname,
    emoji,
    segment_id: segmentId,
    grid_position: gridPosition,
    death_cause: deathCause,
    death_narrative: deathNarrative,
  })

  if (error) {
    console.warn('[DeadPlayers] Record death error:', error.message)
    return false
  }
  return true
}

/**
 * Find undiscovered dead players near current position.
 * Returns at most 1 per turn (random from nearby).
 */
export async function findNearbyDead(
  segmentId: number,
  gridPosition: number,
  myPlayerId: string,
): Promise<DeadPlayer | null> {
  if (!supabase || !supabaseReady.value) return null

  // Search in same segment, within ±3 grids, not already discovered, not own death
  const { data, error } = await supabase
    .from('dead_players')
    .select('*')
    .eq('segment_id', segmentId)
    .gte('grid_position', Math.max(0, gridPosition - 3))
    .lte('grid_position', gridPosition + 3)
    .is('discovered_by', null)
    .neq('player_id', myPlayerId)
    .limit(5)

  if (error || !data || data.length === 0) return null

  // Pick one randomly
  const idx = Math.floor(Math.random() * data.length)
  return data[idx] as DeadPlayer
}

/**
 * Mark a dead player as discovered (player chose "记录")
 */
export async function discoverDead(
  deadId: number,
  discovererId: string,
): Promise<boolean> {
  if (!supabase || !supabaseReady.value) return false

  const { error } = await supabase
    .from('dead_players')
    .update({
      discovered_by: discovererId,
      discovered_at: new Date().toISOString(),
    })
    .eq('id', deadId)
    .is('discovered_by', null) // Only if not yet discovered

  return !error
}

/**
 * "Bring out" dead records on successful completion/descent.
 * Marks them as brought_out and notifies the dead player.
 */
export async function bringOutDead(
  deadIds: number[],
  bringerId: string,
  bringerName: string,
): Promise<void> {
  if (!supabase || !supabaseReady.value || deadIds.length === 0) return

  // Mark all as brought out
  await supabase
    .from('dead_players')
    .update({ brought_out: true, brought_out_by: bringerId })
    .in('id', deadIds)

  // Send notifications to the dead players
  for (const deadId of deadIds) {
    const { data } = await supabase
      .from('dead_players')
      .select('player_id, segment_id, grid_position, death_cause')
      .eq('id', deadId)
      .single()

    if (data) {
      const causeText = data.death_cause ? getCauseText(data.death_cause) : '失踪'
      const message = `你于第${data.segment_id}段海拔处疑似${causeText}，永远留在了山上。` +
        `${bringerName} 经过此处时发现了你的痕迹，并将这一记录带出了山。`

      await supabase.from('notifications').insert({
        player_id: data.player_id,
        message,
      })
    }
  }
}

/**
 * Record a footprint (on successful completion/descent)
 */
export async function recordFootprint(
  playerId: string,
  nickname: string,
  emoji: string,
  endingType: string,
  maxSegmentId: number,
  maxGridPosition: number,
  turnsPlayed: number,
  deadCarried: number[],
): Promise<boolean> {
  if (!supabase || !supabaseReady.value) return false

  const { error } = await supabase.from('footprints').insert({
    player_id: playerId,
    nickname,
    emoji,
    ending_type: endingType,
    max_segment_id: maxSegmentId,
    max_grid_position: maxGridPosition,
    turns_played: turnsPlayed,
    dead_carried: deadCarried.map(String),
  })

  if (error) {
    console.warn('[Footprints] Record error:', error.message)
    return false
  }
  return true
}

/**
 * Fetch recent footprints for the world map background
 */
export async function fetchRecentFootprints(limit = 50): Promise<Array<{
  emoji: string
  nickname: string
  ending_type: string
  max_segment_id: number
  created_at: string
}>> {
  if (!supabase || !supabaseReady.value) return []

  const { data, error } = await supabase
    .from('footprints')
    .select('emoji, nickname, ending_type, max_segment_id, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}

/**
 * Fetch visible dead players on the mountain (for world map markers)
 */
export async function fetchVisibleDead(limit = 30): Promise<Array<{
  segment_id: number
  grid_position: number
  emoji: string
  death_cause: string | null
}>> {
  if (!supabase || !supabaseReady.value) return []

  const { data, error } = await supabase
    .from('dead_players')
    .select('segment_id, grid_position, emoji, death_cause')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}

// ── Helper ──
function getCauseText(cause: string): string {
  const map: Record<string, string> = {
    dehydration: '脱水',
    hypothermia: '失温',
    fall: '滑坠',
    exhaustion: '力竭',
    altitude_sickness: '高反',
  }
  return map[cause] ?? cause
}
