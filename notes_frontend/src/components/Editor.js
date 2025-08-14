import React, { useEffect, useState } from 'react';

/**
 * Editor component
 * Props:
 *  - note: selected note object or null
 *  - onSave: fn({ id, title, content })
 *  - onDelete: fn(id)
 *  - onCreate: fn() -> optional quick-create
 */

// PUBLIC_INTERFACE
export default function Editor({ note, onSave, onDelete, onCreate }) {
  /** Main editor area for selected note with title and content fields. */

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note?.id]); // reset when new note selected

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        id: note?.id,
        title: title || 'Untitled',
        content: content || '',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!note) {
    return (
      <section className="editor">
        <div className="editor-empty">
          <h2>Welcome to Notes</h2>
          <p>Select a note from the left or create a new one to get started.</p>
          {onCreate && (
            <button className="btn btn-primary" onClick={onCreate}>
              Create your first note
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="editor">
      <div className="editor-header">
        <input
          className="title-input"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Note title"
        />
        <div className="actions">
          <button
            className="btn btn-secondary"
            onClick={() => onDelete(note.id)}
            aria-label="Delete note"
          >
            Delete
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            aria-label="Save note"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <textarea
        className="content-textarea"
        placeholder="Start typing your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label="Note content"
      />

      <div className="meta">
        {note.created_at && (
          <span>Created: {new Date(note.created_at).toLocaleString()}</span>
        )}
        {note.updated_at && (
          <span>Last updated: {new Date(note.updated_at).toLocaleString()}</span>
        )}
      </div>
    </section>
  );
}
