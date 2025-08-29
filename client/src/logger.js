import chalk from 'chalk'
import logSymbols from 'log-symbols'
import config from './config'

const getTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
const logger = {
  log: (...args) => {
    console.log(...args)
  },

  success: (...args) => {
    if (import.meta.env.MODE !== 'development') return
    console.log(
      `${logSymbols.success} ${chalk.green('[SUCCESS]')}: ${getTime()}`,
      ...args
    )
  },

  info: (...args) => {
    if (import.meta.env.MODE !== 'development') return
    console.info(
      `${logSymbols.info} ${chalk.blue('[INFO]')}: ${getTime()}`,
      ...args
    )
  },

  debug: (...args) => {
    if (import.meta.env.MODE !== 'development') return
    console.info(
      `${logSymbols.info} ${chalk.magenta('[DEBUG]')}: ${getTime()}`,
      ...args
    )
  },

  warn: (...args) => {
    if (import.meta.env.MODE !== 'development') return
    console.info(
      `${logSymbols.warning} ${chalk.yellow('[WARN]')}: ${getTime()}`,
      ...args
    )
  },

  error: (...args) => {
    if (import.meta.env.MODE !== 'development') return
    console.error(
      `${logSymbols.error} ${chalk.red('[ERROR]')}: ${getTime()}`,
      ...args
    )
  },

  fail: (...args) => {
    if (import.meta.env.MODE !== 'development') return
    console.error(
      `${logSymbols.error} ${chalk.bgRed.white('[FAIL]')}: ${getTime()}`,
      ...args
    )
  },
}

export default logger
