
import React, { FC } from 'react'

// button component using tailwind
/**
 * @Button
 */

interface Props {
  text: string
  onClick?: () => void
  className?: string
}

const Button: FC<Props> = ({ text, onClick, className }) => {
  return (
    <button
      className={`bg-black py-1.5 text-white rounded flex justify-center items-center ${className} rounded-full`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button