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
  env: string
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: highlightCss }]

hljs.configure({
  // optionally configure hljs
  languages: ['javascript', 'ruby', 'python'],
})

function Quill({ defaultValue, setHtml, env }: PropsType) {
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
        ['blockquote'],
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
      'blockquote',
      'clean',
    ],
  })

  const insertToEditor = (url: string) => {
    const range = quill.getSelection()
    quill.insertEmbed(range.index, 'image', url)
  }

  const selectLocalImage = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const imageData = new FormData()
      imageData.set('key', env)
      const file = input.files?.[0]
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      imageData.append('image', file!)
      const res = await window.fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: imageData,
      })
      const data = await res.json()
      console.log(data)
      insertToEditor(data.data.url)
    }
  }

  useEffect(() => {
    if (quill) {
      quill.getModule('toolbar').addHandler('image', selectLocalImage)
    }
  }, [quill])

  useEffect(() => {
    if (quill && defaultValue) {
      quill.on('text-change', () => {
        setHtml(quill.root.innerHTML)
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
