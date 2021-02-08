import Slider from '../slider';
import { mount } from '@vue/test-utils';

const mountComponent = (options = {}) => {
  const component = mount(Slider, options);
  // Mock the slider rect to properly simulate position changes
  component.vm.$refs.slider.getBoundingClientRect = () => {
    return {
      bottom: 20,
      height: 20,
      left: 0,
      right: 100,
      top: 0,
      width: 100
    }
  };
  return component;
}

let wrapper = null

afterEach(() => {
  wrapper.destroy()
})

it('renders correctly', () => {
  wrapper = mountComponent();
  expect(wrapper.html()).toMatchSnapshot();
});

it('renders vertically', () => {
  wrapper = mountComponent({
    propsData: {
      vertical: true
    }
  });
  expect(wrapper.html()).toMatchSnapshot();
});

it('renders inverted', () => {
  wrapper = mountComponent({
    propsData: {
      inverted: true
    }
  });
  expect(wrapper.html()).toMatchSnapshot();
});

it('renders disabled', () => {
  wrapper = mountComponent({
    propsData: {
      disabled: true
    }
  });
  expect(wrapper.html()).toMatchSnapshot();
});

it('should change value on key press', () => {
  wrapper = mountComponent();

  wrapper.trigger('keydown.up');

  expect(wrapper.vm.localValue).toBe(1);

  wrapper.trigger('keydown.down');

  expect(wrapper.vm.localValue).toBe(0);

  wrapper.trigger('keydown.pageup');

  expect(wrapper.vm.localValue).toBe(10);

  wrapper.trigger('keydown.pagedown');

  expect(wrapper.vm.localValue).toBe(0);

  wrapper.trigger('keydown.end');

  expect(wrapper.vm.localValue).toBe(100);

  wrapper.trigger('keydown.home');

  expect(wrapper.vm.localValue).toBe(0);

  wrapper.trigger('keydown.right');

  expect(wrapper.vm.localValue).toBe(1);

  wrapper.trigger('keydown.left');

  expect(wrapper.vm.localValue).toBe(0);
});

it('should increment with a given step size', () => {
  wrapper = mountComponent({
    propsData: {
      stepSize: 10
    }
  });

  wrapper.trigger('keydown.up');
  expect(wrapper.vm.localValue).toBe(10);
})

it('should call change on drag', () => {
  wrapper = mountComponent();

  wrapper.trigger('mousedown');
  expect(wrapper.vm.localValue).toBe(0);
})

it('should emit change event slide start', () => {
  wrapper = mountComponent();

  wrapper.trigger('mousedown');
  expect(wrapper.emitted().change).toBeDefined();
  expect(wrapper.emitted().input).toBeUndefined();
})

it('should emit change event slide end', () => {
  wrapper = mountComponent();

  wrapper.trigger('touchstart');
  wrapper.trigger('touchend');
  expect(wrapper.emitted().change).toBeDefined();
  expect(wrapper.emitted().input).toBeUndefined();
})

it('should emit input event delta slide start', () => {
  wrapper = mountComponent();

  const mouseEvent = {clientX: 50, clientY: 0};
  wrapper.trigger('mouseenter', mouseEvent);
  wrapper.trigger('mousedown', mouseEvent);
  expect(wrapper.emitted().change).toBeDefined();
  expect(wrapper.emitted().input).toBeDefined();
})

it('should emit input event delta slide end', () => {
  wrapper = mountComponent();

  wrapper.trigger('touchstart', {touches: [{clientX: 50, clientY: 0}]});
  wrapper.trigger('touchend');
  expect(wrapper.emitted().change).toBeDefined();
  expect(wrapper.emitted().input).toBeDefined();
})
