import { supabase, supabaseReady } from '@/lib/supabase'

export interface Notification {
  id: number
  message: string
  created_at: string
}

/**
 * Fetch unread notifications for a player
 */
export async function fetchUnreadNotifications(playerId: string): Promise<Notification[]> {
  if (!supabase || !supabaseReady.value) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('id, message, created_at')
    .eq('player_id', playerId)
    .eq('read', false)
    .order('created_at', { ascending: true })

  if (error) {
    console.warn('[Notifications] Fetch error:', error.message)
    return []
  }
  return (data ?? []) as Notification[]
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notifId: number): Promise<void> {
  if (!supabase || !supabaseReady.value) return

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notifId)
}

/**
 * Mark all notifications as read for a player
 */
export async function markAllAsRead(playerId: string): Promise<void> {
  if (!supabase || !supabaseReady.value) return

  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('player_id', playerId)
    .eq('read', false)
}
