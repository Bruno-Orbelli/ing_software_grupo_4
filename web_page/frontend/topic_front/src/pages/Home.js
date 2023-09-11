import React, { useEffect, useState } from 'react';
import Message from '../components/message';
import axios from 'axios';

const Home = () => {

  const [messages, setMessages] = useState([]); // Esto es un hook
  const [users, setUsers] = useState([]); // Esto es un hook
    useEffect(() => {
      /* eslint-disable react-hooks/exhaustive-deps */
        getMessages(); // Esto es lo que se ejecuta cuando se carga la página
    }, []);

    function getMessages() { // Esta función hace una petición GET a la API
        axios.get('/messages/messages') // La API está en el puerto 7000
            .then(function(response) {
                console.log(response.data);
                setMessages(response.data); // Se guarda la respuesta en el hook
                const user_ids = response.data.map((message) => message.user_id);
                getUsersName(user_ids);
            })
            .catch(err => { // Si hay un error, se ejecuta esta función
                console.log(err);
            });
    }

    const getUsersName = (ids) => {
        const user_names = ids.map(id =>
          axios.get(`/users/user/${id}`)
            .then(response => response.data.uname)
            .catch(err => {
              console.log(err);
              return 'Unknown';
          })
        );
        Promise.all(user_names).then((names) => {
          const userNameMap = {};
          ids.forEach((id, index) => {
            userNameMap[id] = names[index];
          });
          setUsers(userNameMap);
        });
    };

  return (
    <div>
      <hr></hr>
      <h1>Messages</h1>
      <hr></hr>
      {messages.map((message, key) =>
        <Message
          key={key}
          id={message.id}
          title={message.title}
          content={message.content}
          likes={message.likes}
          author={users[message.user_id]}
        />
      )}
    </div>
  )
}

export default Home