'use client'

import { useEffect, useState } from "react";

export default function TestPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/get-notes');
            const json = await response.json();
            setData(json);
        }
        fetchData();
    },[])

    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}