'use client'

import { useState } from "react";
import PomodoroNotes from "./Notes";


export default function Pomodoro(){

    const [pom, setPom] = useState(1);
    const [state, setState] = useState("work");
    const [time, setTime] = useState(25);
    const [workLength, setWorkLength] = useState(25);
    const [shortBreakLength, setShortBreakLength] = useState(5);
    const [longBreakLength, setLongBreakLength] = useState(15);
    const [running, setRunning] = useState(false); //if this is true, then the timer is running

    


    return (
        <div>
            <h1>Pomodoro</h1>
            <PomodoroNotes />

        </div>
    )
}

//what are the elements of a pomodoro?
// - current pom (1, 2, 3, or 4)
// - current state (work, short break, long break)
// - amount of time remaining
// - length of work period
// - length of short break
// - length of long break
// - start button
// - pause button
// - reset button
// - score for each pom (1 to 5)

//what does each pom have?
// - a start time
// - a stop time
// - a score
// - a list of tasks
// - a list of notes
// - a list of tags

//what does each task have?
// - a name
// - a pom
// - a description

// 