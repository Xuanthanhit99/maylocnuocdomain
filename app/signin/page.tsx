import SigninComponent from '@/components/Signin/Signin'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className="flex justify-center">
            <SigninComponent type='signin'/>
      </div>
    </div>
  )
}

export default page