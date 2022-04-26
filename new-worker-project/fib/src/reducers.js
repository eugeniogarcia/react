export const reducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_ERROR":
            return { ...state, err: action.err }; //Para visualizar en la pantalla
        case "SET_NUMBER":
            return { ...state, num: action.num }; //Para visualizar en la pantalla
        case "SET_FIBO":
            return {
                ...state,
                computedFibs: [
                    ...state.computedFibs,
                    { id: action.id, nth: action.nth, loading: action.loading },
                ],
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