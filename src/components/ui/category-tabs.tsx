import { Tabs, TabsList, TabsTrigger } from './tabs'

const CATEGORIES = [
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

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
      <TabsList className="flex gap-2 overflow-x-auto p-2 bg-transparent">
        {CATEGORIES.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            className="px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
} 