/* eslint-disable @typescript-eslint/no-explicit-any */
import { LinksFunction } from '@remix-run/node'
import hljs from 'highlight.js'
import highlightCss from 'highlight.js/styles/atom-one-dark.css'
import * as React from 'react'
import { useEffect } from 'react'
import { useQuill } from 'react-quilljs'

type PropsType = {
  defaultValue?: string
  setHtml: React.Dispatch<React.SetStateAction<string | undefined>>
  env: string
  shouldQuillEmpty?: boolean
  height?: string
}

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: highlightCss }]

hljs.configure({
  // optionally configure hljs
  languages: ['javascript', 'ruby', 'python', 'html'],
})

function Quill({ defaultValue, setHtml, env, shouldQuillEmpty, height = '400px' }: PropsType) {
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

        // [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [2, 3, false] }],
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
  useEffect(() => {
    if (quill) {
      quill.root.innerHTML = defaultValue
    }
  }, [quill])

  useEffect(() => {
    if (shouldQuillEmpty) {
      quill.root.innerHTML = ''
    }
  }, [shouldQuillEmpty])

  return (
    <div>
      <div ref={quillRef} style={{ height: height }} />
    </div>
  )
}

export default Quill
