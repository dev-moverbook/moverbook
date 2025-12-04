export function getMissingEnvKeys<T extends Record<string, string | undefined>>(
  env: T
): (keyof T)[] {
  return Object.entries(env)
    .filter(([, value]) => value == null || value === "")
    .map(([key]) => key) as (keyof T)[];
}
