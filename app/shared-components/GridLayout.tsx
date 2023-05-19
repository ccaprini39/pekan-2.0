import { ActionIcon, Box, Divider, Flex, Text } from "@mantine/core";
import { useElementSize, useLocalStorage, useViewportSize } from "@mantine/hooks";
import ReactGridLayout, { Layout, Responsive as ResponsiveGridLayout, ResponsiveProps } from "react-grid-layout";
import { useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import PolyComponent, { LayoutItemProps, LayoutProps } from "./PolyComponent";

export default function GridLayout() {

    const [locked, setLocked] = useState<boolean>(false)
    const { height, width } = useViewportSize();
    const [columns, setColumns] = useLocalStorage({key: 'andon-columns', defaultValue: [{x: 0, width: width, ratio: 1}]})
    const testLayout = [
        {i: '01', x: 0, y: 0, w: 3, h: 10, minW: 3, minH: 10, isDraggable: !locked, isResizable: true, type : 'notes'},
        {i: '02', x: 1, y: 0, w: 3, h: 4, minW: 3, minH: 4, type : 'pomodoro'},
        {i: '03', x: 4, y: 0, w: 3, h: 10, minW: 3, minH: 10, isDraggable: !locked, isResizable: true, type : 'notes'}
    ]

    const [expandedLayout, setExpandedLayout] = useLocalStorage({key: 'dashboard-layout', defaultValue : testLayout} as {key: string, defaultValue: LayoutItemProps[]})

    const copy = [...expandedLayout]

    function toggleLocked(){
        console.log('toggle locked')
        setLocked(!locked)
    }

    const style={
        border : '1px solid lightblue',
        backgroundColor : '#262626',
        borderRadius: '5px',
        width: '98%', height: '96%',
        paddingLeft: '10px', paddingTop: '10px'
    }

    return (
        <>
            <ActionIcon onClick={toggleLocked} 
                variant={locked ? 'filled' : 'outline'} 
                color={locked ? 'red' : 'blue'} 
                radius='xl' size='xl'
            >
                {locked ? 'lock' : 'lock_open'}
            </ActionIcon>
            <ReactGridLayout
                className="layout"
                // style={{backgroundColor: 'darkgray'}}
                resizeHandles={['se', 'e', 's']}
                layout={ getLayoutFromTypedLayout(copy) }
                cols={12}
                rowHeight={30}
                width={width - 30}
                onLayoutChange={(newLayout) => {
                    console.log(expandedLayout)
                    const layoutToUpdate : LayoutItemProps[] = combineLayoutWithTypedLayout(newLayout, expandedLayout)
                    console.log(layoutToUpdate)
                    setExpandedLayout(layoutToUpdate)
                }}
            >
                
                {
                    expandedLayout.map((item) => {
                        return (
                            <div 
                                style={style}
                                key={item.i}
                                data-grid={item}
                            >
                                <PolyComponent key={item.i} itemProps={item} />
                            </div>
                        )
                    })
                }
            </ReactGridLayout>
        </>
    )
}

function combineLayoutWithTypedLayout(layout: Layout[], typedLayout: LayoutItemProps[]) {
    const combinedArray : LayoutItemProps = layout.map((untypedObj, index) => ({
        ...untypedObj,
        type: typedLayout[index]?.type
    }));
    return combinedArray;
}

function getLayoutFromTypedLayout(typedLayout: LayoutItemProps[]) {
    //need to remove the type property

    let result: Layout[] = [];
    for (let i = 0; i < typedLayout.length; i++) {
        let temp = typedLayout[i];
        delete temp.type;
        const untypedLayoutItem = temp as Layout;
        result.push(untypedLayoutItem);
    }
    return result;
}