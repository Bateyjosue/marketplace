import Image from 'next/image'
import Link from 'next/link'
import { type Listing } from '@/lib/supabase'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listing/${listing.id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="mt-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">${listing.price}</p>
              <h3 className="text-sm text-gray-600 line-clamp-2">{listing.title}</h3>
            </div>
          </div>
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <span>{listing.location || 'Palo Alto, CA'}</span>
            <span className="mx-1">·</span>
            <span>{listing.condition || 'Used - Good'}</span>
          </div>
        </div>
      </div>
    </Link>
  )
} 