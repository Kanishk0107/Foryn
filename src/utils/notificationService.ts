import { supabase, isSupabaseConfigured } from './supabaseClient';
import { NotificationItem, NotificationType } from '../types';

// Demo initial notification memory store for offline development
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-101',
    title: '💰 PM Milestone Payment Approved',
    message: 'Project Manager approved milestone payout of ₹2,50,000 for Vikas Woodwork Studio (DLF Camellias).',
    type: 'pm_approval',
    read: false,
    createdAt: '10 mins ago',
    metadata: { projectId: 'PRJ-1001', partyName: 'Vikas Woodwork Studio' }
  },
  {
    id: 'notif-102',
    title: '📌 New Inbound Lead Assigned',
    message: 'Lead Monil Vijay (PID: 1001) assigned to Sales Manager Rishabh Bhardwaj.',
    type: 'lead_assigned',
    read: false,
    createdAt: '25 mins ago',
    metadata: { leadPid: '1001', clientName: 'Monil Vijay' }
  }
];

let localNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

export function getLocalNotifications(): NotificationItem[] {
  return localNotifications;
}

export async function fetchNotificationsFromSupabase(): Promise<NotificationItem[]> {
  if (!supabase || !isSupabaseConfigured) return localNotifications;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error || !data) {
    console.warn('Falling back to local notifications:', error);
    return localNotifications;
  }

  return data.map((n: any) => ({
    id: n.id,
    recipientUserId: n.recipient_user_id,
    title: n.title,
    message: n.message,
    type: n.type as NotificationType,
    read: n.read,
    metadata: n.metadata,
    createdAt: n.created_at
  }));
}

export async function markNotificationAsReadInSupabase(id: string): Promise<boolean> {
  localNotifications = localNotifications.map((n) => (n.id === id ? { ...n, read: true } : n));

  if (!supabase || !isSupabaseConfigured) return true;

  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  return !error;
}

export async function createNotificationInSupabase(
  notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>
): Promise<NotificationItem> {
  const newNotif: NotificationItem = {
    ...notif,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: 'Just now'
  };

  localNotifications = [newNotif, ...localNotifications];

  if (!supabase || !isSupabaseConfigured) return newNotif;

  const { data, error } = await supabase
    .from('notifications')
    .insert([
      {
        title: notif.title,
        message: notif.message,
        type: notif.type,
        read: false,
        metadata: notif.metadata || {}
      }
    ])
    .select()
    .single();

  if (error || !data) return newNotif;

  return {
    id: data.id,
    recipientUserId: data.recipient_user_id,
    title: data.title,
    message: data.message,
    type: data.type,
    read: data.read,
    metadata: data.metadata,
    createdAt: data.created_at
  };
}

export function subscribeToRealtimeNotifications(
  onNewNotification: (notif: NotificationItem) => void
): () => void {
  if (!supabase || !isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('public:notifications')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      (payload) => {
        const n = payload.new;
        const formatted: NotificationItem = {
          id: n.id,
          recipientUserId: n.recipient_user_id,
          title: n.title,
          message: n.message,
          type: n.type as NotificationType,
          read: n.read,
          metadata: n.metadata,
          createdAt: 'Just now'
        };
        localNotifications = [formatted, ...localNotifications];
        onNewNotification(formatted);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
