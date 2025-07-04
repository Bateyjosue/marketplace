'use client'

import { useSearchParams } from 'next/navigation'
import { ListingTypeSelector } from '@/components/ui/listing-type-selector'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { createListing, uploadImage } from '@/lib/supabase'
import { toast } from 'sonner'

export default function CreatePage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    condition: '',
    description: '',
    images: [] as string[]
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setPreviewImage(imageUrl)
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!type) {
    return <ListingTypeSelector />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!previewImage) return

    try {
      await createListing({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        email: '',
        category: formData.category,
        condition: formData.condition,
        location: 'Palo Alto, CA',
        image_url: previewImage,
      })

      toast.success('Listing created successfully!')
    } catch (error) {
      console.error('Error creating listing:', error)
      toast.error('Failed to create listing. Please try again.')
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
            <Select
              id="category"
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select
              id="condition"
              value={formData.condition}
              onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
            >
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </Select>
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

          <Button className="w-full" onClick={handleSubmit}>List Item</Button>
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