import "./NotesContainer.css";

function PreviewNote (note, index, activeIndex) {
    return (
        <div className={`previewNote ${activeIndex===index ? "active": ""}`}>
            <h1>{note.title}</h1>
            <p>{note.content}</p>
        </div>
    )
}

function NotesPreview ({notes, activeIndex}) {
    return (
        <div className="notesPreview">
            {notes.map((note, index) => PreviewNote(note, index, activeIndex))}
        </div>
    )
}

export default NotesPreview;