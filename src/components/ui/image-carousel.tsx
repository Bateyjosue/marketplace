"use client"

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const total = images.length
  const prev = () => setIndex((index - 1 + total) % total)
  const next = () => setIndex((index + 1) % total)

  if (total === 0) return null

  return (
    <div className="relative w-full aspect-square bg-black">
      {/* Current Image */}
      <Image
        src={images[index]}
        alt={`Image ${index + 1}`}
        fill
        className="object-contain select-none"
        priority
      />

      {total > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prev}
            className="absolute top-1/2 -translate-y-1/2 left-4 bg-white/70 hover:bg-white text-gray-800 rounded-full p-1"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          {/* Right Arrow */}
          <button
            onClick={next}
            className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/70 hover:bg-white text-gray-800 rounded-full p-1"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
} 