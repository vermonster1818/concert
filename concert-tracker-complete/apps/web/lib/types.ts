export type ShowStatus = 'Planned' | 'Attended' | 'Skipped'
export interface Show {
  id: string; user_id: string; artist: string; start_at: string; end_at?: string|null
  venue_id?: string|null; venue_name?: string|null; city?: string|null; source_url?: string|null
  status: ShowStatus; rating?: number|null; notes?: string|null; dedupe_key?: string|null
}
