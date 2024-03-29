export function convertDurationToTimeString(duration: number) {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60

  return [
    hours,
    minutes,
    seconds
  ].map(o => String(o).padStart(2, '0')).join(':')
}
