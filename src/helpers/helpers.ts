
export function IsObject(value: any): value is object {
  return (typeof value === 'object') && (value !== null);
}


export function GetProcess(): NodeJS.Process | never {
  if (globalThis.process) {
    return globalThis.process;
  } else {
    throw new Error(`Not on a NodeJS's environment`);
  }
}
