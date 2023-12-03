'use client'

import React, { useEffect } from 'react'

const InitApp: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any)?.Telegram?.WebApp?.expand) {
        (window as any)?.Telegram?.WebApp?.expand()
      }
    }
  }, [])
  return null
}

export default InitApp