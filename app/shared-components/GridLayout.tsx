import { ActionIcon, Box, Button, Divider, Flex, Text } from "@mantine/core";
import { useElementSize, useLocalStorage, useViewportSize } from "@mantine/hooks";
import ReactGridLayout, { Layout, Responsive as ResponsiveGridLayout, ResponsiveProps } from "react-grid-layout";
import { CSSProperties, useEffect, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import PolyComponent, { LayoutItemProps, LayoutProps } from "./PolyComponent";
import { IconCircleX, IconLocationBroken, IconLock, IconLockAccess, IconLockAccessOff, IconLockCancel, IconLockOpen, IconX } from "@tabler/icons-react";
import { get } from "http";

export default function GridLayout() {

    const { height, width } = useViewportSize();
    const testLayout = [
        {i: '01', x: 0, y: 0, w: 3, h: 10, minW: 3, minH: 10, isDraggable: false, isResizable: true, type : 'notes'},
        {i: '02', x: 1, y: 0, w: 3, h: 4, minW: 3, minH: 4, type : 'pomodoro'},
        {i: '03', x: 4, y: 0, w: 3, h: 10, minW: 3, minH: 10, isDraggable: false, isResizable: true, type : 'notes'}
    ]

    const testLayoutString = JSON.stringify(testLayout)

    //removeLocalStorageItem('dashboard-layout')
    const baseLayout : LayoutItemProps[] = JSON.parse(getLocalStorageItem('dashboard-layout', testLayoutString))
    const [expandedLayout, setExpandedLayout] = useState<LayoutItemProps[]>(baseLayout)

    const style : CSSProperties= {
        border : '1px solid lightblue',
        backgroundColor : '#262626',
        borderRadius: '5px',
        width: '98%', height: '96%',
        paddingLeft: '10px', paddingTop: '30px'
    }

    return (
        <>
            <ReactGridLayout
                className="layout"
                // style={{backgroundColor: 'darkgray'}}
                resizeHandles={['se', 'e', 's']}
                layout={ expandedLayout }
                cols={12}
                rowHeight={30}
                width={width - 30}
                onLayoutChange={(newLayout) => {
                    const layoutToUpdate : LayoutItemProps[] = combineLayoutWithTypedLayout(newLayout, expandedLayout)
                    console.log(layoutToUpdate)
                    setLocalStorageItem('dashboard-layout', JSON.stringify(layoutToUpdate))
                    setExpandedLayout(layoutToUpdate)
                }}
            >
                {
                    expandedLayout.map((item : LayoutItemProps) => {
                        const [locked, setLocked] = useState<boolean>(!item.isDraggable || false)
                        const { x, y, w, h, i, type } = item;

                        useEffect(() => {
                            //so what this does is it checks if the item is locked or not
                            //then it updates the item in the layout
                            function updateLayoutItem(){
                                const prevItem = item;
                                const copyContext : LayoutItemProps[] = JSON.parse(getLocalStorageItem('dashboard-layout', testLayoutString))
                                //now I want to overwrite the isDraggable property of the item to be the opposite of locked
                                const newItem = {
                                    ...prevItem,
                                    isDraggable: !locked
                                }
                                //now I want to find the index of the item in the layout
                                const index = copyContext.findIndex((item) => item.i === newItem.i)
                                //now I want to update the layout
                                const newLayout = [...copyContext]
                                newLayout[index] = newItem
                                //now I want to update the state and local storage
                                setLocalStorageItem('dashboard-layout', JSON.stringify(newLayout))
                                setExpandedLayout(newLayout)
                            }
                            updateLayoutItem();
                            return () => {
                                //cleanup
                                console.log('cleanup')
                            }
                        },[locked])

                        function handleWindowClose(){
                            const copyContext : LayoutItemProps[] = JSON.parse(getLocalStorageItem('dashboard-layout', testLayoutString))
                            const newLayout = copyContext.filter((item) => item.i !== i)
                            setLocalStorageItem('dashboard-layout', JSON.stringify(newLayout))
                            setExpandedLayout(newLayout)
                        }

                        const titleBarStyle : CSSProperties = {
                            color: 'white',
                            borderRadius: '5px',
                            position: 'absolute',
                            width: '100%',
                            top: '0px',
                            left: '0px',
                            height: '25px'
                        }

                        return (
                            <div 
                                style={style}
                                key={item.i}
                                data-grid={item}
                            >
                                <div style={titleBarStyle}>
                                    <ActionIcon
                                        style={{float: 'right', marginRight: '5px', marginTop: '2px', height: '20px',  backgroundColor: 'gray'}}
                                        onClick={() => handleWindowClose()}
                                        variant="outline"
                                        disabled={true}
                                        color="red"
                                    >
                                        <IconX />
                                    </ActionIcon>
                                    <ActionIcon
                                        style={{float: 'right', marginRight: '5px', marginTop: '2px', height: '20px',  backgroundColor: 'gray',}}
                                        onClick={() => setLocked(!locked)}
                                        color={locked ? 'black' : 'green'}
                                    >
                                        {locked ? <IconLock /> : <IconLockOpen />}
                                    </ActionIcon>
                                </div>
                                {/* <pre>{JSON.stringify(item, null, 2)}</pre> */}
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
    const combinedArray : LayoutItemProps[] = layout.map((untypedObj, index) => ({
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

function removeLocalStorageItem(key: string) {
    localStorage.removeItem(key);
}

function setLocalStorageItem(key: string, value: string){
    localStorage.setItem(key, value);
}

function getLocalStorageItem(key: string, defaultValue: string){
    return localStorage.getItem(key) || defaultValue;
}