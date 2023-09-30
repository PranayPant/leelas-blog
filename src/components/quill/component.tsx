import * as React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

export default function QuillComponent() {
  const [value, setValue] = React.useState("")
  return (
    <div style={{ whiteSpace: "pre", margin: 30 }}>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  )
}
