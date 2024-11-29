export function getHeader(name) {
  const list = document.cookie.split(';')
  for (let i = 0; i < list.length; i++) {
    const item = list[i].split('=')
    if (item[0].includes(name)) {
      return { Authorization: 'Bearer ' + item[1] }
    }
  }
}
