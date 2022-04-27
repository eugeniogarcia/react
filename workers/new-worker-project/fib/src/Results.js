import React from "react";

export const Results = (props) => { //Retorna todos los calculos que hemos hecho
    const { results } = props;
    return (
        <div id="results-container" className="results-container">
            {results.map((fb) => {
                const { id, nth, time, fibNum, loading } = fb; //Cada calculo de fibonnaci tiene un estado asociado que consta de un id, el número que queremos calcular, el tiempo que se ha tardado en calcular, el resultado, y el estado (true/false, indicando si el calculo se ha terminado ya o no)
                return (
                    <div key={id} className="result-div">
                        {loading ? (
                            <p>
                                Calculating the{" "}
                                <span className="bold" id="nth">
                                    {nth}
                                </span>{" "}
                                Fibonacci number...
                            </p>
                        ) : (
                            <>
                                <p id="timer">
                                    Time: <span className="bold">{time} ms</span>
                                </p>
                                <p>
                                    <span className="bold" id="nth">
                                        {nth}
                                    </span>{" "}
                                    fibonnaci number:{" "}
                                    <span className="bold" id="sum">
                                        {fibNum}
                                    </span>
                                </p>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};