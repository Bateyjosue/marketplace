'use client'

import { useState } from 'react'
import { Button } from './button'
import { Textarea } from './textarea'
import { getListing, sendMessage } from '@/lib/supabase'

interface MessageBoxProps {
  listingId: string
  onClose: () => void
}

const QUICK_MESSAGES = [
  "I'm interested in this item.",
  "Is this item still available?",
  "What condition is this item in?",
  "Do you deliver?"
]

export function MessageBox({ listingId, onClose }: MessageBoxProps) {
  const [newMessage, setNewMessage] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !senderEmail.trim()) return
    setLoading(true)
    setStatus('idle')
    try {
      const listing = await getListing(listingId)
      // Save message in DB
      await sendMessage({
        listing_id: listingId,
        sender_email: senderEmail,
        message: newMessage,
      })
      // Simulate email sending
      const emailBody = `New message about your listing \"${listing.title}\":\n\n${newMessage}\n\nFrom: ${senderEmail}\nView listing: ${window.location.origin}/listing/${listingId}`
      // Send email via API route
      await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: listing.email,
          subject: `New message about: ${listing.title}`,
          html: emailBody.replace(/\n/g,'<br/>')
        })
      })
      setStatus('success')
      setNewMessage('')
      setSenderEmail('')
    } catch (error) {
      setStatus('error')
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickMessage = (message: string) => {
    setNewMessage(message)
  }

  return (
    <div className="flex flex-col h-[420px] max-w-md w-full mx-auto justify-center">
      {/* Quick Message Buttons */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {QUICK_MESSAGES.map((msg, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleQuickMessage(msg)}
            className="text-left px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {msg}
          </button>
        ))}
      </div>
      {/* Sender Email Input */}
      <form onSubmit={handleSubmit} className="mt-auto border-t p-4 bg-white space-y-2">
        <input
          type="email"
          value={senderEmail}
          onChange={e => setSenderEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="w-full px-3 py-2 border rounded mb-2 text-sm"
        />
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none mb-2"
          rows={3}
        />
        <p className="text-xs text-gray-500 mb-2">
          Don&apos;t share your email, phone number or financial information.
        </p>
        {status === 'success' && <div className="text-green-600 text-xs mb-2">Message sent successfully!</div>}
        {status === 'error' && <div className="text-red-600 text-xs mb-2">Failed to send message. Please try again.</div>}
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !newMessage.trim() || !senderEmail.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  )
} 