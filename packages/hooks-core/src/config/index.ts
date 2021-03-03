import path from 'path'
import { UserConfig } from '../types/config'
import { sync } from 'pkg-dir'
import createJITI from 'jiti'

export function getProjectRoot(cwd?: string) {
  return sync(cwd) || process.cwd()
}

export function getConfig(cwd?: string) {
  if (global.MidwayConfig) {
    return global.MidwayConfig
  }

  const root = getProjectRoot(cwd)

  const configs = {
    ts: path.join(root, 'midway.config.ts'),
    js: path.join(root, 'midway.config.js'),
  }

  const userConfig =
    tryRequire<UserConfig>(configs.ts) || tryRequire<UserConfig>(configs.js)

  return {
    source: '/src/apis',
    ...userConfig,
  }
}

export function defineConfig(config: UserConfig): UserConfig {
  return config
}

const tryRequire = <T = unknown>(id: string): T => {
  try {
    const jiti = createJITI()
    const contents = jiti(id)
    if ('default' in contents) return contents.default
    return contents
  } catch {
    return undefined
  }
}