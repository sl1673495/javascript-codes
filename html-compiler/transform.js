export const transform = (ast, visitors) => {
  function traverseNode(node, parent) {
    switch (node.type) {
      case "tag": {
        visitors.tag?.(node, parent)
        return travserChildren(node.children, node)
      }
    }
  }

  function travserChildren(nodes, parent) {
    nodes?.forEach?.((node) => {
      traverseNode(node, parent)
    })
  }

  travserChildren(ast.children, null)
}
