<script>
import variables from '@/styles/variables.scss';
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    activeClass: {
      type: String,
      default: '',
    },
    currentClass: {
      type: String,
      default: '',
    },
  },
  render(h, context) {
    const { icon, title, activeClass, currentClass } = context.props;
    const vnodes = [];

    if (icon) {
      if (activeClass === currentClass && activeClass !== '') {
        vnodes.push(<svg-icon class="theme-color" icon-class={icon} />);
      } else {
        vnodes.push(<svg-icon icon-class={icon} />);
      }
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>);
    }
    return vnodes;
  },
};
</script>
