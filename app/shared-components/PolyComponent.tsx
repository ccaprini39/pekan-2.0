'use client'

import { useState } from "react"
import Notes from "../andon/components/Notes"
import { useElementSize } from "@mantine/hooks";
import PomodoroTimer from "../andon/components/PomodoroTimer";

export default function PolyComponent({itemProps}: {itemProps: LayoutItemProps}){

    const [item, setItem] = useState<LayoutItemProps>(defaultLayoutItemProps)
    const { ref, height, width } = useElementSize();

        const style={
        border : '1px solid blue',
        color: 'white',
        borderRadius: '5px',
    } 

    switch(itemProps.type){
        case 'notes':
            return (
                <div 
                    ref={ref} 
                    style={{width: '98%', height: '96%', paddingLeft: '5px', paddingTop: '5px'}}
                >
                    <Notes height={height} />
                </div>
            )
        case 'pomodoro':
            return (
                <div 
                    ref={ref} 
                    style={{width: '98%', height: '96%', paddingLeft: '5px', paddingTop: '5px'}}
                >
                    <PomodoroTimer />
                </div>
            )
        default:
            return (
                <div
                    ref={ref}
                >
                    default {itemProps.i}
                </div>
            )
    }
}

export interface LayoutItemProps {
    x ? : number,
    y ? : number,
    w ? : number,
    h?: number,
    minW ? : number
    maxW ? : number,
    minH ? : number,
    maxH ? : number,
    i ? : string | undefined,
    static ? : boolean,
    isDraggable ? : boolean,
    isResizable ? : boolean
    isBounded ? : boolean,
    type ? : string,
}

const defaultLayoutItemProps: LayoutItemProps = {
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    minW: 1,
    maxW: 1,
    minH: 1,
    maxH: 1,
    i: 'default',
    static: false,
    isDraggable: true,
    isResizable: true,
    isBounded: true,
}

//this is an array of LayoutItemProps
export interface LayoutProps {
    layout: LayoutItemProps[],
}

//polymorpic component
//it will return 

