'use client'
import { useLocalStorage, useElementSize, useInterval, useViewportSize, useFullscreen } from '@mantine/hooks';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { IconArrowsMaximize, IconArrowsMinimize, IconDeviceFloppy, IconResize } from '@tabler/icons-react';
import { lowlight } from 'lowlight';
import { ActionIcon, Button, ScrollArea, TextInput, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { User, Note, updateNote, CreateOrUpdateNoteRequest } from '@/app/api/get-notes/route';

export default function Notes( { id, initNotes } :  { height : number, id ?: string, initNotes : Note } ){
    const [notes, setNotes] = useLocalStorage({ 'key': `notes${id || ''}`, defaultValue: 'Text Here...' });//this will be in markdown
    const [title, setTitle] = useState<string>(getTodayDateString())

    const { height } = useViewportSize();

    const { toggle, fullscreen } = useFullscreen();

    const interval = useInterval(() => { handleSave() }, 10000);

    useEffect(() => {
        interval.start();
        return interval.stop;
    },[])

    //I need to get the date for today, in the format of DDMMMYYYY
    //ex 22May2023
    function getTodayDateString(){
        if (initNotes && initNotes.title) return initNotes.title;
        else {
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const monthStr = months[month];
            return `${day}${monthStr}${year}`
        }
    }


    let shallowNotes = localStorage.getItem(`notes${id || ''}`) || '';
    if(initNotes){;
        shallowNotes = initNotes.content || '';
    }
    
    //if the first and last characters are quotes, then we need to remove them
    const firstChar = shallowNotes[0];
    const lastChar = shallowNotes[shallowNotes.length - 1];
    //remove the first character
    if(firstChar === `"`) shallowNotes = shallowNotes.slice(1, shallowNotes.length);
    //remove the last character
    if(lastChar === `"`) shallowNotes = shallowNotes.slice(0, shallowNotes.length - 1);
    //the first and last characters are quotes, so we need to remove them

    shallowNotes = rescapeHtml(shallowNotes);

    async function handleSave(){
        const escapedHtml = escapeHtml(notes);
        const updatedNote : CreateOrUpdateNoteRequest = {
            user: initNotes.user.id,
            title: initNotes.title,
            content: escapedHtml,
            tags: initNotes.tags,
        }
        console.log('saved')
        await updateNote(updatedNote, initNotes.id)
    }

    function escapeHtml(unsafe: string) {
        return unsafe
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
    }

    function rescapeHtml(unsafe: string) {
        return unsafe
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");
    }
      
    const editor = useEditor({
        extensions: [
            Highlight,
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph']}),
            Superscript,
            SubScript,
            Link,
            TaskList,
            TaskItem,
            TextStyle,
            Color,
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: shallowNotes || 'Type here...',
        onUpdate({ editor }) {
            const html = editor.getHTML();
            const escapedHtml = escapeHtml(html);
            setNotes(escapedHtml);
        },
    });

    function getPercentageOfHeight(percentage: number){
        return Math.floor( (height - 100) * percentage);
    }

    return (
        <div style={{height : height - 100}}>
            <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60} style={{height : getPercentageOfHeight(.2)}}>
                    <RichTextEditor.ControlsGroup style={{width : '100%'}}>
                        <TextInput
                            style={{width : '100%'}}
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)}
                        />
                    </RichTextEditor.ControlsGroup>
                    
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.ColorPicker
                            colors={[
                                '#ffffff',
                                '#25262b',
                                '#fa5252',
                                '#e64980',
                                '#be4bdb',
                                '#7950f2',
                                '#4c6ef5',
                                '#228be6',
                                '#15aabf',
                                '#12b886',
                                '#40c057',
                                '#82c91e',
                                '#fab005',
                                '#fd7e14',
                            ]}
                        />
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.Superscript />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Code />
                        <RichTextEditor.CodeBlock />
                        
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                    <RichTextEditor.ControlsGroup>
                        <ActionIcon variant='outline' radius={'xs'} size={'sm'} onClick={handleSave}>
                            <IconDeviceFloppy />
                        </ActionIcon>
                        <ActionIcon variant='outline' radius={'xs'} size={'sm'} onClick={toggle} color={fullscreen ? 'red' : 'blue'}>
                            {fullscreen ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
                        </ActionIcon>
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <ScrollArea style={{height : getPercentageOfHeight(.8), paddingBottom : '0'}}>
                    <RichTextEditor.Content style={{minHeight : getPercentageOfHeight(.8), paddingBottom: '0'}} />
                </ScrollArea>
            </RichTextEditor>
        </div>

    )
}

// npm install @tiptap/extension-highlight @tiptap/extension-underline @tiptap/extension-text-align @tiptap/extension-superscript @tiptap/extension-subscript @tiptap/extension-task-list @tiptap/extension-task-item @tiptap/extension-color @tiptap/extension-text-style