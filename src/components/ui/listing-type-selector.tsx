'use client'

import Link from 'next/link'
import { Tag, Car, Home, Layers } from 'lucide-react'

const LISTING_TYPES = [
  {
    id: 'item',
    title: 'Item for sale',
    description: 'Create a single listing for one or more items to sell.',
    icon: Tag
  },
  {
    id: 'vehicle',
    title: 'Vehicle for sale',
    description: 'Sell a car, truck or other type of vehicle.',
    icon: Car
  },
  {
    id: 'home',
    title: 'Home for sale or rent',
    description: 'List a house or apartment for sale or rent.',
    icon: Home
  },
  {
    id: 'multiple',
    title: 'Create multiple listings',
    description: 'Quickly create multiple listings at the same time.',
    icon: Layers,
    learnMore: true
  }
]

export function ListingTypeSelector() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Choose listing type</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LISTING_TYPES.map((type) => {
          const Icon = type.icon
          return (
            <Link
              key={type.id}
              href={type.id === 'multiple' ? '#' : `/create?type=${type.id}`}
              className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">{type.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  {type.learnMore && (
                    <p className="text-sm text-blue-600 mt-2">Learn more</p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 