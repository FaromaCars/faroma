import React from 'react'
import error from '../assets/error404.png'
import { Link } from 'react-router-dom'
const Missing = () => {
  return (
    <div className='min-h-full 2xl:min-h-screen container mx-auto py-20'>
        <div className='flex flex-col  items-center'>
            <p className='text-red-600 font-bold text-4xl md:text-6xl xl:text-9xl'>404 ERROR</p>
            <p className='text-gray-600 font-bold text-xl md:text-4xl pt-2'>Oops, You've lost your engine.</p>
            <img src={error} alt="Error404" className='w-auto lg:h-72 xl:h-96 p-3'/>
            <Link to='/' className="bg-red-600 hover:bg-red-700 px-6 py-2 font-semibold text-lg md:text-xl rounded-full text-white mt-5">
                Back to Home
            </Link>
        </div>
    </div>
  )
}

export default Missing