import "./NotesContainer.css";
import NotesPreview from "./NotesPreview";
import NoteActive from "./NoteActive";
import React, { useState , useRef, useEffect} from "react";
import CameraInput from "../Camera/CameraInput";


let savedNotes = [
    {title: "note1", content: "note 1 content trying out a lot of content to see if it overflows. well, maybe not, but let's see if it works again with eveb more content becausze if there's a lot of content and the div has a max-height, it is bound to overflow ans thus we can force it to be hidden"},
    {title: "note2", content: "note 2 content"},
    {title: "note3", content: "note 3 content"},
    {title: "note4", content: "note 4 content"},
    {title: "note5", content: "note 5 content"},
    {title: "note6", content: "note 6 content"},
    {title: "note7", content: "note 7 content"},
    {title: "note8", content: "note 8 content"},
]

let defaultNote = {
    title: "new note", content: "new note content"
}

function ActiveMenu({activeOptionIndex, deleteMode}) {

    return (
        <div className={`noteMenu`}>
            <button onClick={() => console.log("download")} className={`${activeOptionIndex==0 ? "active": ""}`}>Download</button>
            <button onClick={() => console.log("quit")} className={`${activeOptionIndex==1 ? "active": ""}`}>Quit</button>
            <button onClick={() => console.log("delete")} className={`${activeOptionIndex==2 ? "active": ""}`} style={{backgroundColor: "red"}}>Delete</button>
            {deleteMode && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Confirm Delete : Thumbs_up for Yes, Thumbs_Down for No!</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function PreviewMenu({activeOptionIndex, deleteMode}) {

    return (
        <div className={`noteMenu`}>
            <button onClick={() => console.log("new")} className={`${activeOptionIndex==0 ? "active": ""}`}>New</button>
            <button onClick={() => console.log("duplicate")} className={`${activeOptionIndex==1 ? "active": ""}`}>Duplicate</button>
            <button onClick={() => console.log("delete")} className={`${activeOptionIndex==2 ? "active": ""}`} style={{backgroundColor: "red"}}>Delete</button>
            {deleteMode && (
                <div className="popup">
                    <div className="popup-content">
                        <p color="red">Confirm Delete : Thumbs_up for Yes, Thumbs_Down for No!</p>
                    </div>
                </div>
            )}
        </div>
    )
}


function NotesContainer () {

    let [notes, setNotes] = useState(savedNotes);

    let [activeNoteIndex, setActiveNoteIndex] = useState(0);

    let [noteMode, setNoteMode] = useState(false);

    let [activeOptionIndex, setActiveOptionIndex] = useState(0);

    let [leftCategoryName, setLeftCategoryName] = useState("None");
    let [rightCategoryName, setRightCategoryName] = useState("None");

    let [deleteMode, setDeleteMode] = useState(false);

    //let [addChar, setAddChar] = useState(true)

    const handleKeyPressLeft = (e) => {
        //console.log("got gesture",e);
        if (deleteMode) {
            if (e=="Thumb_Up") {
                console.log(activeNoteIndex, notes.length)
                if (notes.length==1) {
                    setNotes([defaultNote]);
                }
                else if (activeNoteIndex==notes.length-1) {
                    console.log("here")
                    setNotes(notes.slice(0, activeNoteIndex));
                    setActiveNoteIndex((activeNoteIndex-1)%notes.length);
                }
                else {
                    setNotes(Array.prototype.concat(notes.slice(0, activeNoteIndex), notes.slice(activeNoteIndex+1)))
                    setActiveNoteIndex((activeNoteIndex)%notes.length);
                }
                setDeleteMode(false);
            }
            else if (e=="Thumb_Down") {
                setDeleteMode(false)
            }
        }
        else if (e == 'Thumb_Down') {
            // switch between note modes
            setNoteMode(!noteMode);
        }
        else if (e =="Pointing_Up") {
            setActiveOptionIndex((activeOptionIndex+1)%3);
        }
        else {
            if (!noteMode) {
                if (e == 'Thumb_Up') {
                    // switch between note previews
                    setActiveNoteIndex((activeNoteIndex + 1)%notes.length);
                }
                else if (e =="ILoveYou") {
                    console.log("here", activeOptionIndex);
                    if (activeOptionIndex==0) {
                        setNotes(Array.prototype.concat(notes.slice(0, activeNoteIndex+1),[defaultNote],notes.slice(activeNoteIndex+1)));
                        setActiveNoteIndex((activeNoteIndex)%notes.length);
                    }
                    else if (activeOptionIndex==1) {
                        setNotes(Array.prototype.concat(notes.slice(0, activeNoteIndex), [notes[activeNoteIndex]], notes.slice(activeNoteIndex)))
                        setActiveNoteIndex((activeNoteIndex)%notes.length);
                    }
                    else if (activeOptionIndex==2) {
                        console.log("trying delete mode");
                        setDeleteMode(true)
                    }
                }
            }
            else {
                if (e == 'Thumb_Up') {
                    // switch between note previews
                    setActiveNoteIndex((activeNoteIndex + 1)%notes.length);
                }
                else if (e =="ILoveYou") {
                    console.log("here", activeOptionIndex);
                    if (activeOptionIndex==0) {
                        console.log("downloading", activeNoteIndex)
                        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes[activeNoteIndex].content));
                        const dlAnchorElem = document.createElement('a');
                        document.body.appendChild(dlAnchorElem);
                        dlAnchorElem.setAttribute("href",dataStr);
                        dlAnchorElem.setAttribute("download", `${notes[activeNoteIndex].title}.json`);
                        dlAnchorElem.click();
                    }
                    else if (activeOptionIndex==1) {
                        setNoteMode(!noteMode);
                    }
                    else if (activeOptionIndex==2) {
                        setDeleteMode(false)
                    }
                }
            }
        }
    }

    const handleKeyPressRight = (e) => {
        if (noteMode) {
            if (e=="del") {
                let prevNotes = notes;
                let prevNoteContent = prevNotes[activeNoteIndex].content;
                if (prevNoteContent.length > 0) {
                    prevNotes[activeNoteIndex].content = prevNotes[activeNoteIndex].content.substring(0, prevNotes[activeNoteIndex].content.length - 1);
                    setNotes(prevNotes);
                }
            }
            else {
                let prevNotes = notes;
                prevNotes[activeNoteIndex].content = prevNotes[activeNoteIndex].content.concat(e=="space"? " " : e.toLowerCase());
                setNotes(prevNotes);
            }

        }
    }

    useEffect(() => {
        handleKeyPressLeft(leftCategoryName);
    }, [leftCategoryName])

    useEffect(() => {
        handleKeyPressRight(rightCategoryName)
    }, [rightCategoryName])

    return (
        <div className="notesContainer">
            <NotesPreview notes={notes} activeIndex={activeNoteIndex}/>
            <NoteActive note={notes[activeNoteIndex]} noteMode={noteMode}/>
            <div className="sideMenu">
                {noteMode ? 
                    <ActiveMenu activeOptionIndex={activeOptionIndex} deleteMode={deleteMode}/>
                    :
                    <PreviewMenu activeOptionIndex={activeOptionIndex} deleteMode={deleteMode}/>
                }
                <CameraInput leftCategoryName={leftCategoryName} setLeftCategoryName={setLeftCategoryName} rightCategoryName={rightCategoryName} setRightCategoryName={setRightCategoryName} noteMode={noteMode}/>
            </div>
        </div>
    )
}

export default NotesContainer;