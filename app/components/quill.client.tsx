/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LinksFunction } from '@remix-run/node'
import hljs from 'highlight.js'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import * as React from 'react'
import { useEffect } from 'react'
import { useQuill } from 'react-quilljs'

type PropsType = {
  defaultValue?: string
  setHtml: React.Dispatch<React.SetStateAction<undefined>>
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: highlightCss }]

hljs.configure({
  // optionally configure hljs
  languages: ['javascript', 'ruby', 'python'],
})

function Quill({ defaultValue, setHtml }: PropsType) {
  const { quill, quillRef } = useQuill({
    modules: {
      syntax: {
        highlight: (text: string) => {
          return hljs.highlightAuto(text).value
        },
      },
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],

        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],

        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image', 'video'],
        [{ color: [] }, { background: [] }],
        ['code-block'],
        ['block-quote'],
      ],
      clipboard: {
        matchVisual: false,
      },
    },
    formats: [
      'bold',
      'italic',
      'underline',
      'strike',
      'align',
      'list',
      'indent',
      'size',
      'header',
      'link',
      'image',
      'video',
      'color',
      'background',
      'code-block',
      'clean',
    ],
  })
  useEffect(() => {
    if (quill && defaultValue) {
      quill.on('text-change', () => {
        console.log(quillRef.current)
        setHtml(quillRef.current.innerHTML)
      })
    }
  }, [defaultValue, quill])

  return (
    <div>
      <div ref={quillRef} className='h-60' />
    </div>
  )
}

export default Quill
