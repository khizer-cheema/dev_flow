import Link from 'next/link'
import React from 'react'

import ROUTES from '@/constants/routes'

import UserAvatar from '../UserAvatar'

const UserCard = ({_id,name,image,username}:User) => {
  return (
    <div className='shadow-light-100_darknone w-full sx:w-[230px]'>
      <article className='background-light900_dark200 border light-border p-8 flex flex-col items-center justify-center rounded-2xl'>
        <UserAvatar
          id={_id}
<<<<<<< HEAD
          name={name}
          imageUrl={image}
          className='size-[100px] rounded-full object-cover'
          fallbackClassName='text-5xl tracking-widest rounded-full'
=======
          name='name'
          imageUrl={image}
          className='size-[100px] rounded-full object-cover'
          fallbackClassname='text-5xl tracking-widest rounded-full'
>>>>>>> 1b3cefc746cb434c2343e5c20eb7a2743130b822
        />
        <Link
          href={ROUTES.PROFILE(_id)}
          >
            <div className='mt-4 text-center'>
              <h3 className='h3-bold text-dark200_light900 line-clamp-1'>{name}</h3>
              <p className='body-regular text-dark500_light500 mt-2'>{username}</p>
            </div>
        </Link>
      </article>
    </div>
  )
}

export default UserCard