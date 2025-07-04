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
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      // Get listing details for email
      const listing = await getListing(listingId)
      
      // Send email instead of storing in database
      const emailBody = `
        New message about your listing "${listing.title}":
        
        ${newMessage}
        
        View listing: ${window.location.origin}/listing/${listingId}
      `
      
      // In a real app, you'd use an email service here
      // For now, we'll just log it
      console.log('Email would be sent:', {
        to: listing.email,
        subject: `New message about: ${listing.title}`,
        body: emailBody
      })

      setNewMessage('')
      onClose()
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickMessage = (message: string) => {
    setNewMessage(message)
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh]">
      {/* Quick Message Buttons */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {QUICK_MESSAGES.map((msg, index) => (
          <button
            key={index}
            onClick={() => handleQuickMessage(msg)}
            className="text-left px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {msg}
          </button>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="mt-auto border-t p-4 bg-white">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="resize-none mb-2"
          rows={4}
        />
        <p className="text-xs text-gray-500 mb-4">
          Don&apos;t share your email, phone number or financial information.
        </p>
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
            disabled={loading || !newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  )
} 