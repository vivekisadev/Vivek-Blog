"use client"

import { useState } from 'react'
import { subscribeUser } from '@/app/actions/subscribe'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSubscribe() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await subscribeUser(formData)
      setStatus(res.message)
      if (res.success) {
        e.currentTarget.reset()
      }
    } catch (err: any) {
      console.error('Subscription error:', err)
      setStatus('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="bg-zinc-100 dark:bg-zinc-800/50 p-6 rounded-lg my-8">
      <h3 className="text-lg font-semibold mb-2">Subscribe to the newsletter</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Get notified when I publish new posts and notes. No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
        <Input 
          type="email" 
          name="email" 
          placeholder="your@email.com" 
          required 
          className="bg-white dark:bg-zinc-900"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      {status && (
        <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-300">{status}</p>
      )}
    </div>
  )
}
