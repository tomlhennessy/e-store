import { useRouter } from 'next/router'
import React from 'react'

export default function Header() {
  const router = useRouter()

  return (
    <div className='sticky top-0 shadow-lg py-8 flex justify-center items-center bg-white'>
        <h1 onClick={() => router.push('/')} className='flex-1 text-center cursor-pointer select-none transition hover:opacity-50 duration-300'>
            Tom's Apparel
        </h1>
        <div>
            <i className='fa-solid fa-bag-shopping px-2 py-2 text-xl sm:text-3xl mr-4 transition hover:opacity-60 duration-300 cursor-pointer' />
        </div>
    </div>
  )
}
