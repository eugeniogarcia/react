// Link.react.test.js
import React from "react";
import Link from "../src/Link";
import renderer from "react-test-renderer";

test("Comprueba que Link cambie cuando se pasae el ratonpor encima", () => {

    const component = renderer.create(
        <Link page="http://www.facebook.com">Facebook</Link>
    );

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