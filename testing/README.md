# Instalación/Setup

Crea el esqueleto para una aplicación React:

```js
npx create-react-app testing

cd testing

npm start
```

Instalamos las herramientas:

```ps
npm install --save-dev react-test-renderer enzyme enzyme-adapter-react-16 enzyme-to-json
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

## Testing basic component rendering (Snapshot)

Con esta técnica hacemos __regression testing__. Comprobamos que el layout no haya cambiado. La primera vez que se ejecuta el test se guardara un snapshot, se almacena en el directorio `__snapshots__`. En subsiguientes ejecuciones lo que hace la API es comparar con el snapshot previo, y determinar si algo ha cambiado o no.

Para comparar con un snapshot tenemos que __generar el layout__. Hay varias técnicas:

- __shallow__. Incluido con el módulo enzyme. Hace un rendering del componente pero sin incluir sus children. En el layout se incluirán los componentes children, pero sin "explotar", sin redentizar, tal y como los incluimos con el componente padre.

```js
const checkbox = shallow(<CheckboxWithLabel labelOn="On" labelOff="Off" />);

expect(checkbox).toMatchSnapshot();
```

- __renderer.create__. Se hace el rendering completo del componente, incluyendo sus children

```js
const component = renderer.create(<Link page="http://www.facebook.com">Facebook</Link>);
let tree = component.toJSON();
expect(tree).toMatchSnapshot();
```

Podemos interactuar con el rendering, y comprobar como resulta después del cambio:

```js
// manually trigger the callback
tree.onMouseEnter();

tree = component.toJSON();
expect(tree).toMatchSnapshot();
```

- __mount__. Incluido con el módulo enzyme.  Hace un rendering completo del componente:

```js
const comp = mount(<Link nombre="Eugenio" apellido="Garcia" page="http://www.facebook.com">Facebook</Link>);

expect(comp).toMatchSnapshot();

// manually trigger the callback
comp.find('[id="zona"]').simulate('mouseenter');
```

### Más información

Alguna información de detalle. No aportará mucho sobre lo anterior pero para que quede todo documentado. Ejemplo de un test:

```js
import React from 'react';
import Link from '../Link.react';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<Link page="http://www.facebook.com">Facebook</Link>).toJSON();
  expect(tree).toMatchSnapshot();
});
```

El snapshot que se generará la primera vez que se ejecute el test:

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

La idea por lo tanto es que los snapshots se incluyan como parte del fuente. Son, por decirlo de alguna forma, un assert que comprueba que no se haya roto nada de la presentación. Los snapshots son legibles, de modo que cuando un caso de prueba no se supere podamos echar un vistazo al snapshot y comprobar si efectivamente el problema esta con el snapshot - que se ha quedado obsoleto -, o en el componente - que algo se ha roto. Si estuviera en el snapshot, lo borramos y en la siguiente ejecución se creará uno nuevo.

### Shallow vs Normal rendering


```js
const ButtonWithIcon = ({icon, children}) => (<button><Icon icon={icon} />{children}</button>);
```

- shallow

```html
<button>
    <Icon icon="coffee" />
    Hello Jest!
</button>
```

- normal

```html
<button>
    <i class="icon icon_coffee"></i>
    Hello Jest!
</button>
```


## Testing props

Comparando con un valor constante:

```js
test('render a document title', () => {
    const wrapper = shallow(<DocumentTitle title="Events" />);
    expect(wrapper.prop('title')).toEqual('Events');
});

test('render a document title and a parent title', () => {
    const wrapper = shallow(<DocumentTitle title="Events" parent="Event Radar" />);
    expect(wrapper.prop('title')).toEqual('Events - Event Radar');
});
```

Comparando con una regex:

```js
test('render a popover with a random ID', () => {
    const wrapper = shallow(<Popover>Hello Jest!</Popover>);
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