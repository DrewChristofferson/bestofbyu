import React, { useCallback, useEffect, useRef } from 'react'

export default function DropOnClose ({ onClose, children }) {
  const ref = useRef(null)

  const clickListener = useCallback(
    (e) => {
      if (!(ref.current)?.contains(e.target)) {
        onClose?.() // using optional chaining here, change to onClose && onClose(), if required
      }
    },
    [ref.current],
  )
  // Below is the 10 lines of code you need.
  useEffect(() => {
    // Attach the listeners on component mount.
    document.addEventListener('click', clickListener)
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener('click', clickListener)
    }
  }, [])

  return (
    <div
      ref={ref}
    >
      {children}
    </div>
  )
}