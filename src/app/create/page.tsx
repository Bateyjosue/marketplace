'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ListingTypeSelector } from '@/components/ui/listing-type-selector'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { createListing, getListings, uploadImage } from '@/lib/supabase'

const CATEGORIES = [
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

const CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
]

export default function CreatePage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: '',
    email: '',
    images: [] as string[]
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [location, setLocation] = useState('')
  const router = useRouter()
  const [error, setError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const publicUrl = await uploadImage(file)
    setPreviewImage(publicUrl)
    setFormData(prev => ({ ...prev, images: [publicUrl] }))
  }

  if (!type) {
    return <ListingTypeSelector />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // basic validation
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!formData.title.trim() || !formData.price) {
      setError('Title and price are required.')
      return
    }
    try {
      // Prevent duplicate listings
      const allListings = await getListings()
      const duplicate = allListings.find(l =>
        l.title.trim().toLowerCase() === formData.title.trim().toLowerCase() &&
        l.description.trim().toLowerCase() === formData.description.trim().toLowerCase() &&
        l.price === Number(formData.price) &&
        l.category === (formData.category || 'Others') &&
        l.condition === (formData.condition || '') &&
        l.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
      )
      if (duplicate) {
        return
      }

      if (!previewImage) return

      const newListing = await createListing({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        email: formData.email,
        category: formData.category || 'Others',
        condition: formData.condition || '',
        location,
        image_url: previewImage,
      })
      router.push(`/listing/${newListing.id}`)
    } catch (err) {
      console.error('Error creating listing:', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Create new listing</h1>
          
          <div>
            <Label htmlFor="photos">Photos</Label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              <label className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <span className="text-gray-500">+ Add photo</span>
              </label>
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What are you selling?"
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Enter price"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
              className="w-full border rounded px-3 py-2 mb-2"
              required
            >
              <option value="">Select condition</option>
              {CONDITIONS.map(cond => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
              required
              placeholder="Enter location"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you're selling"
              rows={4}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Button className="w-full" type="submit">List Item</Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="border rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Preview</h2>
          
          <div className="aspect-square bg-gray-100 rounded-lg relative">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No image uploaded
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold">{formData.title || 'Title'}</h3>
            <p className="text-2xl font-semibold mt-2">
              {formData.price ? `$${formData.price}` : '$0'}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-500">Details</h4>
            <div className="mt-2 space-y-2">
              {formData.category && (
                <p>Category: {formData.category}</p>
              )}
              {formData.condition && (
                <p>Condition: {formData.condition}</p>
              )}
              {formData.email && (
                <p>Email: {formData.email}</p>
              )}
            </div>
          </div>

          {formData.description && (
            <div>
              <h4 className="font-medium text-gray-500">Description</h4>
              <p className="mt-2">{formData.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 