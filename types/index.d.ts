export type ElfMode = string | null

declare module 'claude-code' {
  interface PluginState {
    'elf-violet': { mode: ElfMode }
  }
}
