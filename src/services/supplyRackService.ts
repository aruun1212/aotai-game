import { supabase, supabaseReady } from '@/lib/supabase'
import { ITEMS } from '@/data/items'

export interface CampItem {
  id: number
  camp_id: string
  owner_id: string
  owner_name: string
  owner_emoji: string
  item_def_id: string
  item_quantity: number
  picked: boolean
  created_at: string
}

const RACK_CAPACITY = 8

/**
 * Fetch active (unpicked, unexpired) items at a camp
 */
export async function fetchRackItems(campId: string): Promise<CampItem[]> {
  if (!supabase || !supabaseReady.value) return []

  const { data, error } = await supabase
    .from('camp_items')
    .select('*')
    .eq('camp_id', campId)
    .eq('picked', false)
    .eq('expired', false)
    .order('created_at', { ascending: false })
    .limit(RACK_CAPACITY)

  if (error) {
    console.warn('[SupplyRack] Fetch error:', error.message)
    return []
  }
  return (data ?? []) as CampItem[]
}

/**
 * Leave an item at camp supply rack.
 * Handles FIFO eviction if rack is full.
 */
export async function leaveItem(
  campId: string,
  playerId: string,
  playerName: string,
  playerEmoji: string,
  itemDefId: string,
  quantity: number,
): Promise<boolean> {
  if (!supabase || !supabaseReady.value) return false

  // Check capacity — evict oldest if full
  const { count } = await supabase
    .from('camp_items')
    .select('id', { count: 'exact', head: true })
    .eq('camp_id', campId)
    .eq('picked', false)
    .eq('expired', false)

  if ((count ?? 0) >= RACK_CAPACITY) {
    // Evict oldest
    const { data: oldest } = await supabase
      .from('camp_items')
      .select('id')
      .eq('camp_id', campId)
      .eq('picked', false)
      .eq('expired', false)
      .order('created_at', { ascending: true })
      .limit(1)

    if (oldest && oldest.length > 0) {
      await supabase
        .from('camp_items')
        .update({ expired: true })
        .eq('id', oldest[0]!.id)
    }
  }

  // Insert new item
  const { error } = await supabase
    .from('camp_items')
    .insert({
      camp_id: campId,
      owner_id: playerId,
      owner_name: playerName,
      owner_emoji: playerEmoji,
      item_def_id: itemDefId,
      item_quantity: quantity,
    })

  if (error) {
    console.warn('[SupplyRack] Leave error:', error.message)
    return false
  }

  // Increment owner's items_left count
  const currentLeft = await getPlayerItemsLeft(playerId)
  await supabase
    .from('players')
    .update({ items_left: currentLeft + 1 })
    .eq('id', playerId)

  return true
}

/**
 * Pick up an item from the rack (N=1)
 * @param skipNotification - true when picking own item (no notification, no stats)
 */
export async function pickItem(
  itemId: number,
  pickerId: string,
  pickerName: string,
  skipNotification = false,
): Promise<{ success: boolean; alreadyPicked?: boolean }> {
  if (!supabase || !supabaseReady.value) return { success: false }

  // Attempt to claim — only succeed if not already picked
  const { data, error } = await supabase
    .from('camp_items')
    .update({
      picked: true,
      picked_by: pickerId,
      picked_at: new Date().toISOString(),
    })
    .eq('id', itemId)
    .eq('picked', false)  // Optimistic lock — only update if still unpicked
    .select()

  if (error) {
    console.warn('[SupplyRack] Pick error:', error.message)
    return { success: false }
  }

  if (!data || data.length === 0) {
    // Someone else got it first
    return { success: false, alreadyPicked: true }
  }

  const item = data[0] as CampItem

  if (skipNotification || item.owner_id === pickerId) {
    // 取回自己的物资：撤销之前的 items_left +1
    const currentLeft = await getPlayerItemsLeft(pickerId)
    if (currentLeft > 0) {
      await supabase
        .from('players')
        .update({ items_left: currentLeft - 1 })
        .eq('id', pickerId)
    }
  } else if (item.owner_id && item.owner_id !== pickerId) {
    // 取他人物资：更新统计和发通知
    const currentHelped = await getPlayerPeopleHelped(item.owner_id)
    await supabase
      .from('players')
      .update({ people_helped: currentHelped + 1 })
      .eq('id', item.owner_id)

    // Create notification for owner
    const itemDef = ITEMS[item.item_def_id]
    const itemName = itemDef?.name ?? item.item_def_id
    const campName = getCampDisplayName(item.camp_id)
    await supabase
      .from('notifications')
      .insert({
        player_id: item.owner_id,
        message: `你在${campName}留下的${itemName}被一位旅人捡走了。`,
      })
  }

  return { success: true }
}

/**
 * Get player's pick count for current run (from localStorage)
 */
export function getLocalPickCount(): number {
  const raw = localStorage.getItem('aotai-pick-count')
  return raw ? parseInt(raw, 10) : 0
}

export function incrementLocalPickCount() {
  const current = getLocalPickCount()
  localStorage.setItem('aotai-pick-count', String(current + 1))
}

export function resetLocalPickCount() {
  localStorage.removeItem('aotai-pick-count')
}

// ── Helpers ──

async function getPlayerItemsLeft(playerId: string): Promise<number> {
  if (!supabase) return 0
  const { data } = await supabase
    .from('players')
    .select('items_left')
    .eq('id', playerId)
    .single()
  return data?.items_left ?? 0
}

async function getPlayerPeopleHelped(playerId: string): Promise<number> {
  if (!supabase) return 0
  const { data } = await supabase
    .from('players')
    .select('people_helped')
    .eq('id', playerId)
    .single()
  return data?.people_helped ?? 0
}

function getCampDisplayName(campId: string): string {
  const map: Record<string, string> = {
    'camp-2900': '2900营地',
    'camp-shuiwozi': '水窝子',
    'camp-2800': '2800营地',
    'camp-dayehai': '大爷海',
  }
  return map[campId] ?? campId
}
