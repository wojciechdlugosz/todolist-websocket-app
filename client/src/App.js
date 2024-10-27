import io from "socket.io-client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const App = () => {

  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState(null);

  useEffect(() => {
    const socket = io("ws://localhost:8000", { transports: ["websocket"] });
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  const removeTask = (id) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    socket.emit('removeTask', id);
  };

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ name: taskName, id: uuidv4() });
    socket.emit('addTask', { name: taskName, id: uuidv4() });
    setTaskName("");
  };

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  };

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(({ id, name }) => (
            <li key={id} className="task">
              {name}{" "}
              <button onClick={() => removeTask(id)} className="btn btn--red">
                Remove
              </button>
            </li>
          ))}
        </ul>
  
        <form onSubmit={submitForm} id="add-task-form">
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
  
      </section>
    </div>
  );
}

export default App;
