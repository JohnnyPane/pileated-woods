import React from 'react'
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '@fontsource/lora';
import '@fontsource/lora/400-italic.css';
import '@fontsource/lora/700.css';
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { FlashProvider } from './context/FlashContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ fontFamily: 'Lora, serif' }}>
      <Notifications position="top-center" />
      <FlashProvider>
        <App />
      </FlashProvider>
    </MantineProvider>
  </React.StrictMode>
)
