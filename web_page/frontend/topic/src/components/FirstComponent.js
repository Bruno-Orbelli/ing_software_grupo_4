import React, {useState} from 'react';

export const FirstComponent = () => {

    //let nombre = "Agustin";
    let apellido = "Montana";

    // Estructura variable, funcion
    const [nombre, setNombre] = useState("Agustin");

    let lista = [
        {id: 1, nombre: "Leonardo", apellido: "Casillas"},
        {id: 2, nombre: "Juan", apellido: "Montana"},
        {id: 3, nombre: "Laura", apellido: "Fuentes"},
    ];

    const cambiarNombre = (nuevoNombre) => {
        setNombre(nuevoNombre);
    }

  return (
    <div>
        <h1>FirstComponent</h1>
        <p>This is my first component</p>
        <p>My name is {nombre} {apellido}</p>
        <button onClick={ 
                e => cambiarNombre("Victor Juan") 
            }>
            Cambiar nombre
        </button>
        <input type="text" onChange={ e => cambiarNombre(e.target.value) } />
        <ul>
            { 
                lista.map((item) => { 
                    return (<li key={item.id}>
                        {item.nombre} {item.apellido}
                    </li>) 
                }) 
            }
        </ul>
    </div>
  )
}
