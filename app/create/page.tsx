"use client"

import { useState, useRef, useEffect } from 'react'
import { createContent, getAvailableTags, parseMarkdown } from '@/app/actions/content'
import { uploadImage } from '@/app/actions/upload'
import { MarkdownContent } from '@/components/markdown-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Layout } from '@/components/layout'
import { FileText, StickyNote, Send, Bold, Italic, Link as LinkIcon, Image as ImageIcon, Code, List } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminGate } from '@/components/admin-gate'

export default function CreateContent() {
  const [type, setType] = useState<'post' | 'note'>('post')
  const [loading, setLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const tagsInputRef = useRef<HTMLInputElement>(null)

  const handlePreviewToggle = async () => {
    if (!isPreview) {
      const content = textareaRef.current?.value || ''
      setPreviewHtml('<p className="text-zinc-500">Generating preview...</p>')
      setIsPreview(true)
      const html = await parseMarkdown(content)
      setPreviewHtml(html)
    } else {
      setIsPreview(false)
    }
  }

  useEffect(() => {
    getAvailableTags().then(tags => setAvailableTags(tags))
    
    // Load draft from localStorage
    const savedDraft = localStorage.getItem('blog-draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        if (draft.type) setType(draft.type)
        if (textareaRef.current) textareaRef.current.value = draft.content || ''
        if (tagsInputRef.current) tagsInputRef.current.value = draft.tags || ''
        const titleInput = document.getElementById('title') as HTMLInputElement
        if (titleInput) titleInput.value = draft.title || ''
        toast.info('Draft restored', { description: 'Your unsaved content was loaded.' })
      } catch (e) {}
    }
  }, [])

  const saveDraft = () => {
    const titleInput = document.getElementById('title') as HTMLInputElement
    const draft = {
      type,
      content: textareaRef.current?.value || '',
      tags: tagsInputRef.current?.value || '',
      title: titleInput?.value || ''
    }
    localStorage.setItem('blog-draft', JSON.stringify(draft))
  }

  const appendTag = (tag: string) => {
    if (!tagsInputRef.current) return
    const currentVal = tagsInputRef.current.value
    if (currentVal.length === 0) {
      tagsInputRef.current.value = tag
    } else if (currentVal.endsWith(',')) {
      tagsInputRef.current.value = `${currentVal} ${tag}`
    } else {
      tagsInputRef.current.value = `${currentVal}, ${tag}`
    }
  }

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const selected = text.substring(start, end)
    const after = text.substring(end)

    textarea.value = `${before}${prefix}${selected || (suffix ? 'text' : '')}${suffix}${after}`
    textarea.focus()
    textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : (suffix ? 4 : 0)))
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text')
    const isUrl = /^https?:\/\//.test(pastedText)
    
    if (isUrl) {
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      
      // If text is selected, wrap it in a link instead of replacing it
      if (start !== end) {
        e.preventDefault()
        const text = textarea.value
        const selected = text.substring(start, end)
        const before = text.substring(0, start)
        const after = text.substring(end)
        
        textarea.value = `${before}[${selected}](${pastedText})${after}`
        textarea.setSelectionRange(start, start + selected.length + pastedText.length + 4)
      }
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await uploadImage(formData)
      if (res.success) {
        insertMarkdown(`![${file.name.split('.')[0]}](${res.url})`)
        toast.success('Image uploaded successfully')
      } else {
        toast.error(res.message)
      }
    } catch (err: any) {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('type', type)
    
    try {
      const res = await createContent(formData)
      if (res.success) {
        toast.success('Success!', {
          description: res.message,
        })
        form.reset()
        localStorage.removeItem('blog-draft')
      } else {
        toast.error('Failed to save', {
          description: res.message
        })
      }
    } catch (err: any) {
      toast.error('An error occurred', {
        description: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminGate>
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Header showBackButton={true} />
        
        <main className="mt-12 mb-20">
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
              New {type === 'post' ? 'Post' : 'Note'}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Publish your latest thoughts to the digital garden.
            </p>
          </header>
          
          <div className="mb-8 flex gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-px">
            
            <button
              type="button"
              onClick={() => setType('post')}
              className={`flex items-center pb-3 text-sm font-medium transition-colors relative ${
                type === 'post' 
                  ? 'text-zinc-900 dark:text-zinc-100' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Blog Post
              {type === 'post' && (
                <motion.div layoutId="activeTab" className="absolute -bottom-px left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setType('note')}
              className={`flex items-center pb-3 text-sm font-medium transition-colors relative ${
                type === 'note' 
                  ? 'text-zinc-900 dark:text-zinc-100' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
              }`}
            >
              <StickyNote className="w-4 h-4 mr-2" />
              Daily Note
              {type === 'note' && (
                <motion.div layoutId="activeTab" className="absolute -bottom-px left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-100" />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {type === 'post' && (
                    <motion.div
                      key="post-fields"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-zinc-700 dark:text-zinc-300">Title</Label>
                        <Input 
                          id="title" 
                          name="title" 
                          onChange={saveDraft}
                          placeholder="What are you writing about?"
                          required 
                          className="h-12 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags" className="text-zinc-700 dark:text-zinc-300">Tags</Label>
                        <Input 
                          id="tags" 
                          name="tags" 
                          ref={tagsInputRef}
                          onChange={saveDraft}
                          placeholder="e.g. React, WebDev, Life (comma-separated)" 
                          className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-all"
                        />
                        {availableTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {availableTags.map(tag => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => appendTag(tag)}
                                className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-zinc-700 dark:text-zinc-300">Publish Date</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    required 
                    defaultValue={new Date().toISOString().split('T')[0]} 
                    className="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-all w-full sm:w-auto"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <Label htmlFor="content" className="text-zinc-700 dark:text-zinc-300 mr-4">Content</Label>
                      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-md p-0.5">
                        <button
                          type="button"
                          onClick={() => isPreview && handlePreviewToggle()}
                          className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${!isPreview ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                        >
                          Write
                        </button>
                        <button
                          type="button"
                          onClick={() => !isPreview && handlePreviewToggle()}
                          className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${isPreview ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                    {!isPreview && (
                      <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-x-auto overflow-y-hidden pb-1 sm:pb-1 w-full sm:w-auto justify-start sm:justify-end no-scrollbar">
                      <button type="button" onClick={() => insertMarkdown('**', '**')} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300" title="Bold">
                        <Bold className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => insertMarkdown('_', '_')} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300" title="Italic">
                        <Italic className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
                      <button type="button" onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300" title="Link">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={uploadingImage}
                        className={`p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300 ${uploadingImage ? 'opacity-50 cursor-wait' : ''}`} 
                        title="Upload Image"
                      >
                        {uploadingImage ? (
                          <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                          <ImageIcon className="w-4 h-4" />
                        )}
                      </button>
                      <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1" />
                      <button type="button" onClick={() => insertMarkdown('\n- ')} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300" title="List">
                        <List className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => insertMarkdown('\n```\n', '\n```\n')} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300" title="Code Block">
                        <Code className="w-4 h-4" />
                      </button>
                    </div>
                    )}
                  </div>
                  
                  <div className={`min-h-[300px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md p-6 overflow-x-hidden ${isPreview ? 'block' : 'hidden'}`}>
                    {previewHtml ? <MarkdownContent content={previewHtml} /> : <p className="text-zinc-500 italic">No content to preview.</p>}
                  </div>
                  
                  <Textarea 
                    id="content" 
                    name="content" 
                    ref={textareaRef}
                    onPaste={handlePaste}
                    onChange={saveDraft}
                    placeholder="Write your markdown content here... (Tip: Paste a URL over selected text to create a link!)"
                    required={!isPreview}
                    rows={12} 
                    className={`font-mono text-sm leading-relaxed resize-y bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 transition-all p-4 mt-2 ${isPreview ? 'hidden' : 'block'}`} 
                  />
                </div>
                
                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto h-11 px-8 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Publishing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Publish {type === 'post' ? 'Post' : 'Note'}
                        <Send className="ml-2 w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
        </main>
        
        <Footer />
      </div>
    </Layout>
    </AdminGate>
  )
}
