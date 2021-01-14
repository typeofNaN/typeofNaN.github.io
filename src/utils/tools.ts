export const nowTime = (): string => {
  const now = new Date()

  const hour = now.getHours()
  const minute = now.getMinutes()
  return (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
}