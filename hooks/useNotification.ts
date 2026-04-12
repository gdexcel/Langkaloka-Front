import { useState } from "react"

export const useNotification = () => {
  const [count, setCount] = useState(0)

  const addNotif = () => {
    setCount((prev) => prev + 1)
  }

  const resetNotif = () => {
    setCount(0)
  }

  return { count, addNotif, resetNotif }
}