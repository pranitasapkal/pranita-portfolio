import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/archivo/index.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
/* v2 type layers: Fraunces (display serif) · Hanken Grotesk (body) · Caveat (handwritten micro) */
import '@fontsource-variable/fraunces/index.css'
import '@fontsource-variable/hanken-grotesk/index.css'
/* Bricolage Grotesque — case-page display face (.v1-paper re-declares --font-display) */
import '@fontsource-variable/bricolage-grotesque/index.css'
import '@fontsource/caveat/500.css'
import './styles/base.css'
// Register GSAP plugins once before any component uses them.
import './lib/gsap'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
