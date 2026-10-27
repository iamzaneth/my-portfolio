import { createContext, useContext } from 'react'

export const CompanionContext = createContext<{ discovery: string; discover: (message: string) => void }>({
  discovery: '',
  discover: () => { /* Supplied by App. */ },
})
export const useCompanion = () => useContext(CompanionContext)
