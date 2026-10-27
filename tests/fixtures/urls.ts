export function projectFixture(count: number, mode = 'mixed') {
  const url = new URL('/tests/fixtures/projects.html', process.env.PLAYWRIGHT_FIXTURE_URL ?? 'http://127.0.0.1:4176')
  url.searchParams.set('count', String(count))
  url.searchParams.set('mode', mode)
  return url.href
}
