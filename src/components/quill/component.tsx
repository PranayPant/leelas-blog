import * as React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

export default function QuillComponent() {
  const [value, setValue] = React.useState("")
  return (
    <div className="whitespace-pre m-3">
      <ReactQuill className="h-30 bg-slate-200" theme="snow" value={value} onChange={setValue} />
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  )
}
