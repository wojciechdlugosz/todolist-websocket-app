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

    // listeners 
    socket.on('addTask', (newTask) => addTask(newTask));
    socket.on('removeTask', id => removeTask(id));
    socket.on('updateData', (updatedTasks) => updateTasks(updatedTasks));

    return () => {
      socket.disconnect();
    };
  }, []);

  const removeTask = (id, emitEvent = false) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if (emitEvent) {
      socket.emit('removeTask', id);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const task = { name: taskName, id: uuidv4() };
    addTask(task);
    socket.emit('addTask', task);
    setTaskName("");
  };

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  };

  const updateTasks = (updatedTasks) => {
    setTasks(tasks => [...tasks, ...updatedTasks]);
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
              <button onClick={() => removeTask(id, true)} className="btn btn--red">
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
