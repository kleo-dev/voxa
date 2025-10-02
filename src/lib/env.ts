export function env(name: string): string | undefined {
  return process.env[name];
}

export function envEnsure(name: string): string {
  const v = process.env[name];

  if (v === undefined) {
    throw new Error(
      `Environment variable '${name}' is required but doesn't exist`
    );
  }

  return v;
}

export function envNumber(name: string): number | undefined {
  const v = process.env[name];
  return v ? parseInt(v) : undefined;
}

export function envNumberEnsure(name: string): number {
  const v = process.env[name];

  if (v === undefined) {
    throw new Error(
      `Environment variable '${name}' is required but doesn't exist`
    );
  }

  return parseInt(v);
}
