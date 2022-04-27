/*
El estado tiene tres propiedades que corresponden al error que se muestra en pantalla, al campo donde se ingresa el número a calcular, y una lista - array - con todos los resultados que tenemos hasta el momento
*/
export const reducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_ERROR":
            return { ...state, err: action.err }; //Para visualizar en la pantalla el error
        case "SET_NUMBER":
            return { ...state, num: action.num }; //Para ingresar en la pantalla el número a calcular
        case "SET_FIBO":
            return {
                ...state,
                computedFibs: [
                    ...state.computedFibs,
                    { id: action.id, nth: action.nth, loading: action.loading },
                ], //El estado incluye la lista con todos los calculos de fibonnaci que hemos hecho
            }; //Corresponde a lanzar un calculo de fibonnaci
        case "UPDATE_FIBO": {
            const curr = state.computedFibs.filter((c) => c.id === action.id)[0];
            const idx = state.computedFibs.indexOf(curr);
            curr.loading = false;
            curr.time = action.time;
            curr.fibNum = action.fibNum;
            state.computedFibs[idx] = curr;
            return { ...state };
        } //Corresponde a terminar un calculo de fibonnaci
        default:
            return state;
    }
};