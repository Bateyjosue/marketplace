'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/ui/search-bar'
import { ListingCard } from '@/components/ui/listing-card'
import { getListings, type Listing } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings()
        setListings(data)
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || listing.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    'All',
    'Vehicles',
    'Property Rentals',
    'Apparel',
    'Electronics',
    'Entertainment',
    'Family',
    'Garden & Outdoor',
    'Hobbies',
    'Home Goods',
    'Musical Instruments',
    'Others',
  ]

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="w-64 p-4 border-r bg-white min-h-[calc(100vh-3.5rem)] flex-shrink-0">
        <div className="space-y-2">
          <h2 className="font-semibold text-xl mb-4">Categories</h2>
          <nav className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search marketplace"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Today&apos;s picks</h1>
            <p className="text-sm text-gray-500">Palo Alto · Within 2mi</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={{...listing, category: listing.category || 'Others'}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
