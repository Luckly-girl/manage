<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    addclass: {
      type: String,
      default: ''
    },
  },
  render(h, context) {
    const { icon, title, addclass } = context.props
    const vnodes = []
    const _class = addclass ? addclass : ''
    const _icon = 'iconfont ' + icon
    if (icon) {
    //  vnodes.push(<svg-icon icon-class={icon}/>)
      vnodes.push(<i class={_icon}/>)
    }

    if (title) {
      vnodes.push(<span class={ _class } slot='title'>{(title)}</span>)
    }
    return vnodes
  },
}
</script>

<style scoped>
em.subCopy {
  display: inline-block;
}
</style>
