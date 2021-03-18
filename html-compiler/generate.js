export const generate = (ast) => {
  function generateNode(node) {
    const { type } = node
    if (type === "tag") {
      return generateTag(node)
    } else if (type === "text") {
      return generateText(node)
    }
  }

  function generateTag(node) {
    const { tag, attrs, children } = node

    const tagStart = `<${tag}`
    const tagAttrs = generateAttrs(attrs.value)
    const tagChildren = generateChildren(children)
    const tagEnd = `</${tag}>`

    return `${tagStart}${tagAttrs}>${tagChildren}${tagEnd}`
  }

  function generateText(node) {
    return node.value
  }

  function generateAttrs(attrs = []) {
    const keys = Object.keys(attrs)
    return keys.reduce((str, key) => {
      const value = attrs[key]
      return `${str} ${key}="${value}"`
    }, "")
  }

  function generateChildren(children = []) {
    return children.map(generateNode).join("")
  }

  return generateChildren(ast.children)
}
