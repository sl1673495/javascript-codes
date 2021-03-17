const parse = (html) => {
  let str = html

  function parseChildren() {
    const nodes = []

    while (str) {
      let node
      const char = str[0]
      if (char === "<") {
        // Tag
        const nextChar = str[1]
        if (/[a-z]/i.test(nextChar)) {
          // Start of tag
          node = parseElement()
        } else if (nextChar === "/") {
          // End of tag
          const [endTag] = /<\/.*?>/.exec(str)
          go(endTag.length)
          continue
        }
      } else {
        node = parseText()
      }

      if (node) {
        nodes.push(node)
      }
    }

    return nodes
  }

  function parseElement() {
    const match = /<([a-z][^\t\r\n\f />]+)/i.exec(str)
    const [raw, tag] = match
    go(raw.length)

    const attrs = parseAttributes()
    const children = parseChildren()

    return {
      type: "tag",
      tag,
      attrs,
      children,
    }
  }

  function parseText() {
    // Content of element
    const textMatch = /[^<]*/.exec(str)
    if (textMatch) {
      const [text] = textMatch
      go(text.length)
      return {
        type: "text",
        value: text,
      }
    }
  }

  function parseAttributes() {
    const attrs = {}
    goSpaces()

    while (!str.startsWith(">") && !str.startsWith("/>")) {
      const matchName = /(.*?)=/.exec(str)
      const [rawName, name] = matchName
      go(rawName.length)

      // Parse value
      const quoteMatch = /'|"/.exec(str[0])
      if (quoteMatch) {
        // Quoted value.
        const [quote] = quoteMatch
        go(1)

        const end = str.indexOf(quote)
        const value = str.substr(0, end)
        // Included quote
        go(value.length + 1)
        attrs[name] = value
      } else {
        // Unquoted value
        const [value] = /^[^\t\r\n\f >]+/.exec(str)
        go(value.length)
        attrs[name] = value
      }

      goSpaces()
    }

    // Skip end '>' of tag
    go(1)

    if (Object.keys(attrs).length) {
      return {
        type: "attrs",
        value: attrs,
      }
    }
  }

  function goSpaces() {
    const match = /^[\t\r\n\f ]+/.exec(str)
    if (match) {
      go(match[0].length)
    }
  }

  function go(len) {
    str = str.slice(len)
  }

  return parseChildren()
}

console.log(
  JSON.stringify(
    parse("<div class='a b c' data-name=test><span>asd</span></div>")
  )
)