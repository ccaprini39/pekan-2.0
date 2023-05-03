'use client'

import { ActionIcon, Badge, Button, Flex, Group, NumberInput, Space } from "@mantine/core";
import useSound from "use-sound";
import { IconReload } from '@tabler/icons-react'
import { useDidUpdate } from "@mantine/hooks";
import { useState } from "react";

export default function PomodoroTimer(){

    const [state, setState] = useState("waiting");
    const [workTime, setWorkTime] = useState(25); //this is the time that the timer started
    const [shortBreakTime, setShortBreakTime] = useState(5); //this is the time that the timer started
    const [time, setTime] = useState(minutesToMilliseconds(workTime));
    const [timeStarted, setTimeStarted] = useState(0); //this is the time that the timer started
    const [displayTime, setDisplayTime] = useState(millisecondsToMinutesAndSeconds(workTime)); //this is the time that the timer started
    const [timeToStop, setTimeToStop] = useState(0); //this is the time that the timer should stop
    const [running, setRunning] = useState(false); //if this is true, then the timer is running

    function startTimer(){
        setTimeStarted(Date.now());
        setTimeToStop(Date.now() + (minutesToMilliseconds(workTime)) ); //this is the time that the timer should stop
        setState("work");
        setRunning(true);
    }

    function resetTimer(){
        setTimeStarted(0);
        setTimeToStop(0);
        setTime(minutesToMilliseconds(workTime));
        setDisplayTime(millisecondsToMinutesAndSeconds(minutesToMilliseconds(workTime)));
        setState("waiting");
        setRunning(false);
    }

    const [playAlert] = useSound('/alert.mp3');
    

    useDidUpdate(() => {
        //while running is true
        function stopTimer(){
            setTime(0)
            setDisplayTime("0:0");
            if (state == "work"){
                playAlert();
                setState("short break");
                setTimeStarted(Date.now());
                setTime(minutesToMilliseconds(shortBreakTime));
                setTimeToStop(Date.now() + (minutesToMilliseconds(shortBreakTime)) ); //this is the time that the timer should stop
            } else if (state == "short break"){
                playAlert();
                setState("waiting");
                setRunning(false);
            }
        } 
        async function moveTimerForward(){
            if (time > 0){
                if(running){
                    if(Date.now() > timeToStop){
                        stopTimer();
                    }
                    else{
                        await sleep(1000);
                        setTime(timeToStop - Date.now());
                        setDisplayTime(millisecondsToMinutesAndSeconds(timeToStop - Date.now()));
                    }
                }
            } else {
                stopTimer();
            }
        }
        if(running) moveTimerForward();
    }, [running, time])
    
    function minutesToMilliseconds(minutes: number){
        return minutes * 60000;
    }

    async function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function millisecondsToMinutesAndSeconds(milliseconds: number){
        let minutes = Math.floor(milliseconds / 60000);
        let seconds = Math.floor((milliseconds % 60000) / 1000);
        return minutes + ":" + seconds;
    }

    function getColor(){
        if (state == "work"){
            return "green";
        } else if (state == "short break"){
            return "yellow";
        } else {
            return "blue"; 
        }
    }


    //lets have a function that will run every second
    //if the timer is running, then it 

    //what is the actual behaviour that I want?  I want it to run for a period of time, alert for short break, then wait for you to start it 

    return (
        <Group position="right">
            <NumberInput 
                value={workTime}
                label="Work Time"
                size="xs"
                onChange={(value : number) => {
                    setWorkTime(value);
                    setTime(minutesToMilliseconds(value));
                    setDisplayTime(millisecondsToMinutesAndSeconds(minutesToMilliseconds(value)));
                }}
                disabled={running}
            />
            <NumberInput
                value={shortBreakTime}
                label="Short Break"
                size="xs"
                onChange={(value : number) => {
                    setShortBreakTime(value);
                }}
                disabled={running}
            />

            <Badge variant="outline" size="lg" color={getColor()}>
                <Flex>
                    {state}
                    <Space w='md'/>
                    {displayTime}
                </Flex>
            </Badge>
            <Button disabled={running} variant="subtle" size="xs" onClick={startTimer}>Start</Button>
            <ActionIcon color="green" variant="subtle" size="xs" onClick={resetTimer}>
                <IconReload />
            </ActionIcon>
        </Group>
    )
}