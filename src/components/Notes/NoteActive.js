import "./NotesContainer.css";

function NoteActive ({note, noteMode}) {
    //console.log("active", note);
    return (
        <div className={`noteActive ${noteMode ? "active": ""}`}>
            <h1>{note.title}</h1>
            <p>{note.content}</p>
        </div>
    )
}

export default NoteActive;