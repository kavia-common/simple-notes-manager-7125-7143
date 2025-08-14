import { supabase, isSupabaseConfigured } from '../supabaseClient';

/**
 * Notes service layer
 * Provides CRUD and search features interacting with Supabase 'notes' table.
 * Table schema expected:
 *  id: uuid (primary key, default gen_random_uuid())
 *  title: text
 *  content: text
 *  created_at: timestamptz
 *  updated_at: timestamptz
 */

// Handle case where Supabase is not configured: throw explicit errors
function ensureConfigured() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(
      'Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in your environment.'
    );
  }
}

// PUBLIC_INTERFACE
export async function getNotes(searchTerm = '') {
  /** Fetch all notes, optionally filtering by a case-insensitive searchTerm on title or content. */
  ensureConfigured();
  let query = supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });

  if (searchTerm && searchTerm.trim().length > 0) {
    // Using OR with ilike for title/content search
    query = query.or(
      `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data || [];
}

// PUBLIC_INTERFACE
export async function getNoteById(id) {
  /** Fetch a single note by id. */
  ensureConfigured();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function createNote({ title = 'Untitled', content = '' } = {}) {
  /** Create a new note with optional title/content; returns the created note. */
  ensureConfigured();
  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, content }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /** Update an existing note by id, returns updated note. */
  ensureConfigured();
  const payload = {
    ...(title !== undefined ? { title } : {}),
    ...(content !== undefined ? { content } : {}),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('notes')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. Returns true if deletion succeeds. */
  ensureConfigured();
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) {
    throw error;
  }
  return true;
}
