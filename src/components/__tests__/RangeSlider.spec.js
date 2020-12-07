import RangeSlider from '../RangeSlider';
import { mount } from '@vue/test-utils';

const mountComponent = (options = {}) => {
  return mount(RangeSlider, options);
}

let wrapper = null;

afterEach(() => {
  wrapper.destroy();
})

it('renders multiple thumbs', () => {
  wrapper = mountComponent({ 
    propsData: {
      value: [10, 50]
    }
  });
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
