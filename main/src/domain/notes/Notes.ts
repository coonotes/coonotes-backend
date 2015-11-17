import { NoteRepository } from './NoteRepository';
import { Note, NoteCreator } from './Note';
import { NoteId } from "./NoteId";

export class Notes {
    constructor(private repository: NoteRepository) {
        this.repository = repository || new NoteRepository();
    }

    public async create(creator: NoteCreator, title: string, body: string): Promise<Note> {
        const note = creator.createNote(title, body);
        return await this.repository.save(note);
    }

    public async rename(noteId: NoteId, title: string): Promise<Note> {
        const note = await this.repository.findById(noteId);
        return await this.repository.save(note.rename(title));
    }

    public async shareTo(noteId: NoteId, collaborator: string): Promise<Note> {
        const note = await this.repository.findById(noteId);
        return await this.repository.save(note.share(collaborator));
    }

    public async transferTo(noteId: NoteId, newNoteOwner: string): Promise<Note> {
        const note = await this.repository.findById(noteId);
        return await this.repository.saveBySingle(note.transfer(newNoteOwner));
    }
}
