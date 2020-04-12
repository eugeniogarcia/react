// Link.react.test.js
import React from "react";
import Boton from "../Boton";
import renderer from "react-test-renderer";

const clickFn = jest.fn();

describe("Mock functions", () => {
  test("mock", () => {
    const component = mount(<Boton mensaje="escriba algo" envio={clickFn} />);

    console.log(component.debug())

    const input = component.find('input[type="text"]');
    input.simulate("change", { target: { value: "abc" } });

    //component.find("input").at(1).simulate('click');
    //const input1 = component.find('input[type="submit"]');
    //input1.simulate("click");
    component.simulate("submit");
    
    expect(clickFn).toHaveBeenCalled();

  });
});
