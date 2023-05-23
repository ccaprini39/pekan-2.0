import Notes from "@/app/andon/components/Notes";
import { getNotesByUser } from "@/app/api/get-notes/route";

async function loadData(){
    const notes = await getNotesByUser();
    return {notes}
}

export default async function NotesPage(){

    const {notes} = await loadData();

    const testNotes = notes[0]

    return (
        <div>
            <Notes initNotes={testNotes} />
        </div>
    )
}