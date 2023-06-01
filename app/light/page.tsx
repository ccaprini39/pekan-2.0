'use client'

import { ActionIcon } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import { IconArrowsMaximize, IconArrowsMinimize } from "@tabler/icons-react";

export default function LightPage(){

    const { toggle, fullscreen } = useFullscreen();

    const style = {
        width: '100wv',
        height: '100vh',
        backgroundColor: 'white',
    }
    
    return (
        <div style={style}>
            Light Page
            <ActionIcon variant='outline' radius={'xs'} size={'sm'} onClick={toggle} color={fullscreen ? 'red' : 'blue'}>
                {fullscreen ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
            </ActionIcon>

        </div> 
    )
}

//