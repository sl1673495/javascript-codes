function trim(str) {
  let i = 0
  let j = str.length - 1

  function isWhite(s) {
    return /\s/.test(s)
  }

  while (isWhite(str[i])) {
    i++
  }
  while (isWhite(str[j])) {
    j--
  }

  return str.substring(i, j + 1)
}

console.log(trim('    as d  '))