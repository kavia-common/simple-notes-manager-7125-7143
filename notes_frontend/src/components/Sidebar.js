import React from 'react';

/**
 * Sidebar component
 * - Search input
 * - "New Note" button
 * - List of notes
 * Props:
 *  - notes: array of notes
 *  - selectedId: id of selected note
 *  - searchTerm: current search text
 *  - onSearchChange: fn(text)
 *  - onSelect: fn(id)
 *  - onNew: fn()
 */

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedId,
  searchTerm,
  onSearchChange,
  onSelect,
  onNew,
}) {
  /** Sidebar navigation for notes with search and new note action. */

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">Notes</h1>
        <button className="btn btn-accent" onClick={onNew} aria-label="Create a new note">
          + New Note
        </button>
      </div>

      <div className="search-wrap">
        <input
          type="text"
          className="input"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search notes"
        />
      </div>

      <div className="notes-list" role="list" aria-label="Notes list">
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes found</p>
          </div>
        ) : (
          notes.map((note) => {
            const isActive = selectedId === note.id;
            const title = note.title?.trim() || 'Untitled';
            const preview =
              (note.content || '').replace(/\s+/g, ' ').trim().slice(0, 80) ||
              'No content yet...';

            return (
              <button
                key={note.id}
                className={`note-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(note.id)}
                role="listitem"
              >
                <div className="note-item-title">{title}</div>
                <div className="note-item-preview">{preview}</div>
                {note.updated_at && (
                  <div className="note-item-date">
                    {new Date(note.updated_at).toLocaleString()}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
