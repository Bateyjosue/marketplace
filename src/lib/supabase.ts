import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
Run these SQL commands in your Supabase SQL editor in order:

-- Create listings table
create table listings (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text not null,
    price numeric not null,
    email text not null,
    category text not null,
    condition text,
    location text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create messages table
create table messages (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid references listings(id) on delete cascade,
    sender_email text not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table listings enable row level security;
alter table messages enable row level security;

-- Create policies for listings table
create policy "Public profiles are viewable by everyone"
on listings for select
to public
using (true);

create policy "Anyone can create a listing"
on listings for insert
to public
with check (true);

create policy "Anyone can update their own listing"
on listings for update
to public
using (true);

create policy "Anyone can delete their own listing"
on listings for delete
to public
using (true);

-- Create policies for messages table
create policy "Messages are viewable by sender and recipient"
on messages for select
to public
using (true);

create policy "Anyone can send a message"
on messages for insert
to public
with check (true);
*/

// Typed helper functions for listings
export type Listing = {
  id: string
  title: string
  description: string
  price: number
  email: string
  category: string
  image_url: string
  created_at: string
  condition?: string
  location?: string
}

// Message types and functions
export type Message = {
  id: string
  listing_id: string
  sender_email: string
  message: string
  created_at: string
}

// Helper function to upload image
export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage
    .from('listing-images')
    .upload(filePath, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('listing-images')
    .getPublicUrl(filePath)

  return publicUrl
}

// Helper function to fetch listings
export async function getListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Listing[]
}

// Helper function to fetch a single listing
export async function getListing(id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Listing
}

// Helper function to create a listing
export async function createListing(listing: Omit<Listing, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('listings')
    .insert([listing])
    .select()
  
  if (error) throw error
  return data[0] as Listing
}

// Helper function to fetch messages for a listing
export async function getMessages(listingId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data as Message[]
}

// Helper function to send a message
export async function sendMessage(message: Omit<Message, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
  
  if (error) throw error
  return data[0] as Message
} 