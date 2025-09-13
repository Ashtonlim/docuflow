// global config file

const config = {
  API_URL: `${import.meta.env.VITE_API_URL || 'http://localhost'}:${import.meta.env.VITE_API_PORT || '8000'}`,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'APP',
  APP_PATH: `http://localhost:${import.meta.env.VITE_APP_PORT}`,
  BASE_PATH: import.meta.env.VITE_BASE_PATH || '/',
}

export default config
