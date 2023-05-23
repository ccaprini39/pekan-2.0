'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getXataClient } from "@/src/xata";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const response = new Response(JSON.stringify(session), {
        headers: {
            "content-type": "application/json",
        },
    });
    return response;
}

export interface Note {
    id : string;
    user : User;
    title : string | null;
    content : string | null;
    xata : {
        createdAt : Date | null;
        updatedAt : Date | null;
        version : number;
    }
    tags : string;
}

export interface User {
    id? : string;
    email : string;
    emailVerified? : Date | null;
    name? : string | null;
    image? : string | null;
}

export async function getNotesByUser(){
    const session = await getServerSession(authOptions);
    if (session === null || !session || !session.user) throw new Error("Session is null");
    const user = session.user as User;
    const response = await fetch(
        "https://collin-caprini-s-workspace-fs8hhd.us-east-1.xata.sh/db/pekan-2:main/tables/notes/query",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.XATA_API_KEY}`,
            },
            body: '{"columns":["*","user.*"],"page":{"size":100}}'
        }
    );
    const queryResponse : PaginatedNotesQueryResults = await response.json()
    const notes : Note[] = queryResponse.records;
    const filteredNotes = notes.filter(note => note.user.email === user.email);
    return filteredNotes;
}

const samplePaginatedQuery =
{
    "meta": {
      "page": {
        "cursor": "yjKsViouKcrMS1eyilbSUtJRKi1OLdLTUorVUSrOLyoBiWamgHhpmUXFYG5RanJ8coa5RUZhupmJkamlcYZhRmKShQFIUU4iEWoyczNLlKwMTXWU0nIS04uVrAxquQABAAD__w",
        "more": false,
        "size": 15
      }
    },
    "records": [
      {
        "content": "A long note",
        "created": "2023-05-21T16:06:08.404Z",
        "id": "rec_ch78hqg642593h1hab80",
        "title": "default",
        "user": {
          "email": "ccaprini39@gmail.com",
          "emailVerified": "2023-05-11T00:00:00Z",
          "id": "rec_ch77u30642593h1h9e90",
          "image": "https://lh3.googleusercontent.com/a/AGNmyxb5ON4Lxu7Z75JDyV4F3lQSWyAFXXIXp4MAlINk=s96-c",
          "name": "Collin Caprini",
          "xata": {
            "createdAt": "2023-05-04T10:58:33.895104Z",
            "updatedAt": "2023-05-21T16:14:51.075015Z",
            "version": 1
          }
        },
        "xata": {
          "createdAt": "2023-05-04T10:58:35.18778Z",
          "updatedAt": "2023-05-21T16:13:08.137868Z",
          "version": 1
        }
      }
    ]
}

interface PaginatedNotesQueryResults {
    meta : {
        page : {
            cursor : string;
            more : boolean;
            size : number;
        }
    }
    records : Note[];
}

export async function getUserIdFromSession(session : any){
    if (session === null || !session || !session.user) throw new Error("Session is null");
    const user = session.user as User;
    return user.id;
}

export interface CreateOrUpdateNoteRequest {
    user : string;
    title : string;
    content : string;
    tags : string;
}

export async function updateNote(newNote : CreateOrUpdateNoteRequest, id : string){
    //const xata = getXataClient();
    const options = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.XATA_API_KEY}`,
        },
        body: JSON.stringify(newNote)
    };
    
    try {
        const response = await fetch(
            `https://collin-caprini-s-workspace-fs8hhd.us-east-1.xata.sh/db/pekan-2:main/tables/notes/data/${id}?columns=id`,
            options
        )
    } catch (error : any) {
        console.log(error.message)
    }
}