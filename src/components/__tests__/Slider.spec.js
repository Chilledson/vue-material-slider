import Slider from '../slider';
import { mount } from '@vue/test-utils';

const mountComponent = (options = {}) => {
  return mount(Slider, options);
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

  console.log(wrapper)
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
