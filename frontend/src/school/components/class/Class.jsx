import { useEffect } from "react"

export default function Class() {

    useEffect(() => {
        console.log("object")

        return () => { console.log("Component unmounted!")}
    },[])
    return (
        <>
            <h1>C</h1>
        </>
    )
}