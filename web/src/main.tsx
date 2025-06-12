import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'




const Global = () => {
  return (
    <div>hello Github!</div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global />
  </StrictMode>,
)