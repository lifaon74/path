export function getProcess(): NodeJS.Process | never {
  if ('process' in globalThis) {
    return (globalThis as any).process;
  } else {
    throw new Error("Not on a NodeJS's environment");
  }
}
