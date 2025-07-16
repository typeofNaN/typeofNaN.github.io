'use client'

import Typeit from 'typeit-react'

const Home = () => {
  const options = {
    strings: 'Hello typeofNaN',
    lifeLike: true,
    speed: 120,
    loop: true
  }

  return (
    <div className="m-auto container">
      <Typeit options={options} className="text-18px" />
    </div>
  )
}

export default Home
