# Instalación/Setup

Instalamos las herramientas:

```ps
npm install --save-dev react-test-renderer enzyme enzyme-adapter-react-16 enzyme-to-json
```

Actualizamos package.json

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
},
"jest": {
  "setupFiles": ["./test/jestsetup.js"],
  "snapshotSerializers": ["enzyme-to-json/serializer"]
}
```

Creamos un archivo de configuracion para jest en `test/jestsetup.js`

```js
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;
```

Añadimos en el package.json la entrada pensando en los módulos css:

```js
"jest": {
  "moduleNameMapper": {
    "^.+\\.(css|scss)$": "identity-obj-proxy"
  }
}
```

e instalamos:

```ps
npm install --save-dev identity-obj-proxy
```

# Creando Tests

## Testing basic component rendering

```js
import React from 'react';
import Link from '../Link.react';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<Link page="http://www.facebook.com">Facebook</Link>).toJSON();
  expect(tree).toMatchSnapshot();
});
```

The first time this test is run, Jest creates a snapshot file that looks like this

```yaml
exports[`renders correctly 1`] = `
<a
  className="normal"
  href="http://www.facebook.com"
  onMouseEnter={[Function]}
  onMouseLeave={[Function]}
>
  Facebook
</a>
`;
```

The snapshot artifact should be committed alongside code changes, and reviewed as part of your code review process. Jest uses pretty-format to make snapshots human-readable during code review. On subsequent test runs Jest will compare the rendered output with the previous snapshot. If they match, the test will pass. If they don't match, either the test runner found a bug in your code (in this case, it's <Link> component) that should be fixed, or the implementation has changed and the snapshot needs to be updated.

Otros ejemplos con shallow:


```js
test('render a label', () => {
    const wrapper = shallow(<Label>Hello Jest!</Label>);
    expect(wrapper).toMatchSnapshot();
});

test('render a small label', () => {
    const wrapper = shallow(<Label small>Hello Jest!</Label>);
    expect(wrapper).toMatchSnapshot();
});

test('render a grayish label', () => {
    const wrapper = shallow(<Label light>Hello Jest!</Label>);
    expect(wrapper).toMatchSnapshot();
});
```

## Testing props

Comparando con un valor constante:

```js
test('render a document title', () => {
    const wrapper = shallow(
        <DocumentTitle title="Events" />
    );
    expect(wrapper.prop('title')).toEqual('Events');
});

test('render a document title and a parent title', () => {
    const wrapper = shallow(
        <DocumentTitle title="Events" parent="Event Radar" />
    );
    expect(wrapper.prop('title')).toEqual('Events — Event Radar');
});
```

Comparando con una regex:

```js
test('render a popover with a random ID', () => {
    const wrapper = shallow(
        <Popover>Hello Jest!</Popover>
    );
    expect(wrapper.prop('id')).toMatch(/Popover\d+/);
});
```

## Testing events

```js
test('render Markdown in preview mode', () => {
    const wrapper = shallow(<MarkdownEditor value="*Hello* Jest!" />);

    expect(wrapper).toMatchSnapshot();

    wrapper.find('[name="toggle-preview"]').simulate('click');

    expect(wrapper).toMatchSnapshot();
});
```

Podemos comprobar cual fue el efecto en el componente del evento:

```js
test('open a code editor', () => {
    const wrapper = mount(<Playground code={code} />);

    expect(wrapper.find('.ReactCodeMirror')).toHaveLength(0);

    wrapper.find('button').simulate('click');

    expect(wrapper.find('.ReactCodeMirror')).toHaveLength(1);
});
```

## Testing event handlers

```js
test('pass a selected value to the onChange handler', () => {
    const value = '2';
    const onChange = jest.fn();
    const wrapper = shallow(<Select items={ITEMS} onChange={onChange} />);

    expect(wrapper).toMatchSnapshot();

    wrapper.find('select').simulate('change', {target: { value }});

    expect(onChange).toBeCalledWith(value);
});
```

Si queremos interactuar con un componente hijo, en lugar de shallow - que no renderiza los children - usamos mount:

```js
it('should be possible to activate button with Spacebar', () => {
  const component = mount(<MyComponent />);
  
  component.find('button#my-button-one').simulate('keydown', { keyCode: 32 });
  
  expect(component).toMatchSnapshot();
  
  component.unmount();
});
```

## Mock functions

```js
const clickFn = jest.fn();

describe('MyComponent', () => {
  it('button click should hide component', () => {
    const component = shallow(<MyComponent onClick={clickFn} />);

    component.find('button#my-button-two').simulate('click');
	
    expect(clickFn).toHaveBeenCalled();
  });
});
```

### Ejemplo

- Creamos un mock de `save-to-storage`

```js
jest.mock('save-to-storage', () => ({   }));
```

- El mock devuelve un objeto que tiene una propiedad llamada `SaveToStorage`

```js
jest.mock('save-to-storage', () => (
	{   
		SaveToStorage: jest.fn().mockImplementation(() => ({ }))
	}
));
```

- La implementación del mock retorna dos métodos:

```js
  SaveToStorage: jest.fn().mockImplementation(() => ({
    tryGetValue: mockTryGetValue,
    trySetValue: mockTrySetValue,
  }))
```

- Estos dos métodos están mockeados:

```js
const mockTryGetValue = jest.fn(() => false);
const mockTrySetValue = jest.fn(); 
 ```
 
```js
const mockTryGetValue = jest.fn(() => false);
const mockTrySetValue = jest.fn(); 
 
jest.mock('save-to-storage', () => ({   
  SaveToStorage: jest.fn().mockImplementation(() => ({
    tryGetValue: mockTryGetValue,
    trySetValue: mockTrySetValue,
  })), 
}));

describe('MyComponent', () => {
  it('should set storage on save button click', () => {
    mockTryGetValue.mockReturnValueOnce(true);
    
	const component = mount(<MyComponent />); 
    
	component.find('button#my-button-three').simulate('click');
    
	expect(mockTryGetValue).toHaveBeenCalled();
    
	expect(component).toMatchSnapshot();
    
	component.unmount();   
  });    
});
```