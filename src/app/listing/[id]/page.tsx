'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getListing, type Listing } from '@/lib/supabase'
import { MessageBox } from '@/components/ui/message-box'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { use } from 'react'

type PageProps = {
  params: Promise<{ id: string }>
}

export default function ListingPage({ params }: PageProps) {
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMessageBox, setShowMessageBox] = useState(false)
  const id = use(params).id

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(id)
        setListing(data)
      } catch (error) {
        console.error('Error fetching listing:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!listing) {
    return <div>Listing not found</div>
  }

  return (
    <div>
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative aspect-square">
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              <p className="text-2xl font-semibold mt-2">${listing.price}</p>
              <p className="text-sm text-gray-500 mt-1">
                Listed {new Date(listing.created_at).toLocaleDateString()} in {listing.location || 'Unknown location'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowMessageBox(true)}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Message
              </Button>
              <Button variant="outline" className="flex-1">
                Save
              </Button>
              <Button variant="outline" className="flex-1">
                Share
              </Button>
            </div>

            <div>
              <h2 className="font-semibold text-lg">Details</h2>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500">Condition</h3>
                  <p className="mt-1">{listing.condition || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Category</h3>
                  <p className="mt-1">{listing.category}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg">Description</h2>
              <p className="mt-2 text-gray-600">{listing.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Box Dialog */}
      {showMessageBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Message Seller</h2>
              <button
                onClick={() => setShowMessageBox(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="w-12 h-12">
                <Image
                  src={listing.image_url}
                  alt={listing.title}
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{listing.title}</h3>
                <p className="text-lg font-semibold">${listing.price}</p>
              </div>
            </div>
            <MessageBox 
              listingId={listing.id} 
              onClose={() => setShowMessageBox(false)} 
            />
          </div>
        </div>
      )}
    </div>
  )
} 