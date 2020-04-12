// Link.react.test.js
import React from "react";
import Link from "../Link";
import renderer from "react-test-renderer";

describe('Testing basic component rendering', () => {
    test("renderer.create", () => {

        const component = renderer.create(<Link page="http://www.facebook.com">Facebook</Link>);

        /*Comprobación con snapshot
        Con esta técnica hacemos regression testing. Comprobamos que el layout
        no haya cambiado.
        La primera vez que se ejecuta el test se guardara un snapshot, se almacena
        en el directorio `__snapshots__`. En subsiguientes ejecuciones lo que hacemos es comparar con el snapshot previo
        */
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // manually trigger the callback
        tree.props.onMouseEnter();

        // re-rendering
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();

        // manually trigger the callback
        tree.props.onMouseLeave();
        
        // re-rendering
        tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test("shallow", () => {

        const componente = shallow(<Link nombre="Eugenio" apellido="Garcia">
            <a href="www.elpais.com">El Pais</a>
            <br />
            <a href="www.spiegel.de">Der Spiegel</a>
            <br />
            <a href="www.sn.at">Salzburger</a>
        </Link>);

        expect(componente).toMatchSnapshot();
        // manually trigger the callback
        componente.simulate('mouseenter');

        expect(componente).toMatchSnapshot();

        // manually trigger the callback
        componente.simulate('mouseleave');
        expect(componente).toMatchSnapshot();
    });    

    test("mount", () => {

        const comp = mount(<Link nombre="Eugenio" apellido="Garcia" page="http://www.facebook.com">Facebook</Link>);

        expect(comp).toMatchSnapshot();

        // manually trigger the callback
        comp.find('[id="zona"]').simulate('mouseenter');

        expect(comp).toMatchSnapshot();

        // manually trigger the callback
        comp.find('div').simulate('mouseleave');
        expect(comp).toMatchSnapshot();
    });    
});

describe('Testing props', () => {

    test("props", () => {

        const comp = mount(<Link nombre="Eugenio" apellido="Garcia" page="http://www.facebook.com">Facebook</Link>);

        expect(comp.props().nombre).toEqual('Eugenio');
        comp.setProps({ nombre: 'Eugenio', apellido: 'Garcia Zach' });
        expect(comp.props().apellido).toEqual('Garcia Zach');

    });    

});