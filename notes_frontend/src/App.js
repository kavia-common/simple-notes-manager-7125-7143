import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
} from './services/notesService';
import { isSupabaseConfigured } from './supabaseClient';

function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root application: two-panel notes UI with Supabase integration. */

  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState('');

  const debouncedSearch = useDebouncedValue(search, 400);

  // Initial configuration check
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setBanner(
        'Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.'
      );
    }
  }, []);

  // Load notes, refetch on search
  useEffect(() => {
    let canceled = false;
    async function fetchNotes() {
      setLoading(true);
      try {
        const data = await getNotes(debouncedSearch);
        if (!canceled) {
          setNotes(data);
          // If no selected note, select the first one
          if (data.length > 0 && !selectedId) {
            setSelectedId(data[0].id);
          }
          // If selected note no longer exists (filtered out), clear selection
          if (selectedId && !data.find((n) => n.id === selectedId)) {
            setSelectedId(null);
          }
        }
      } catch (err) {
        console.error(err);
        if (!canceled) {
          setBanner(err.message || 'Failed to load notes.');
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    fetchNotes();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // PUBLIC_INTERFACE
  async function handleCreateNote() {
    /** Create a new note with default content and select it. */
    try {
      const newNote = await createNote({
        title: 'Untitled',
        content: '',
      });
      setNotes((prev) => [newNote, ...prev]);
      setSelectedId(newNote.id);
      setBanner('');
    } catch (err) {
      console.error(err);
      setBanner(err.message || 'Failed to create note.');
    }
  }

  // PUBLIC_INTERFACE
  async function handleSaveNote({ id, title, content }) {
    /** Save the provided note by id; updates the local state. */
    try {
      const updated = await updateNote(id, { title, content });
      setNotes((prev) =>
        prev
          .map((n) => (n.id === id ? updated : n))
          .sort(
            (a, b) =>
              new Date(b.updated_at || 0).getTime() -
              new Date(a.updated_at || 0).getTime()
          )
      );
      setSelectedId(updated.id);
      setBanner('');
    } catch (err) {
      console.error(err);
      setBanner(err.message || 'Failed to save note.');
    }
  }

  // PUBLIC_INTERFACE
  async function handleDeleteNote(id) {
    /** Delete note by id and update state/selection. */
    const confirmed = window.confirm('Delete this note? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setSelectedId((current) => {
        if (current !== id) return current;
        // pick the next available
        const remaining = notes.filter((n) => n.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      });
      setBanner('');
    } catch (err) {
      console.error(err);
      setBanner(err.message || 'Failed to delete note.');
    }
  }

  // PUBLIC_INTERFACE
  async function handleSelectNote(id) {
    /** Select a note by id; fetch latest from server to ensure freshness. */
    try {
      setSelectedId(id);
      const latest = await getNoteById(id);
      setNotes((prev) => prev.map((n) => (n.id === id ? latest : n)));
      setBanner('');
    } catch (err) {
      console.error(err);
      // fallback: selection remains but no update
      setBanner(err.message || 'Failed to load the selected note.');
    }
  }

  return (
    <div className="app-root">
      {banner && (
        <div className="banner" role="alert">
          {banner}
        </div>
      )}
      <div className="app-layout">
        <Sidebar
          notes={notes}
          selectedId={selectedId}
          searchTerm={search}
          onSearchChange={setSearch}
          onSelect={handleSelectNote}
          onNew={handleCreateNote}
        />
        <main className="main-area">
          {loading && <div className="loading">Loading...</div>}
          {!loading && (
            <Editor
              note={selectedNote}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
              onCreate={handleCreateNote}
            />
          )}
        </main>
      </div>
    </div>
  );
}
