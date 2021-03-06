import React, { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import { readTodos, createTodo, updateTodo, deleteTodo } from './functions';

function App() {
  const [todo, setTodo] = useState({ title: '', content: '' });
  const [todos, setTodos] = useState(null);
  const [currentId, setCurrentId] = useState(0);

  useEffect(() => {
    let currentTodo =
      currentId !== 0
        ? todos.find((todo) => todo._id === currentId)
        : { title: '', content: '' };

    setTodo(currentTodo);
  }, [currentId, todos]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await readTodos();
      setTodos(result);
    };

    fetchData();
  }, [currentId]);

  useEffect(() => {
    const clearField = (e) => {
      if (e.keycode === 27) {
        clear();
      }
    };

    window.addEventListener('keydown', clearField);
    return () => window.removeEventListener('keydown', clearField);
  }, []);

  const clear = () => {
    setCurrentId(0);
    setTodo({ title: '', content: '' });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      const result = await createTodo(todo);
      setTodos([...todos, result]);
      clear();
    } else {
      await updateTodo(currentId, todo);
      clear();
    }
  };

  const removeTodo = async (id) => {
    await deleteTodo(id);
    clear();
    const result = await readTodos();
    setTodos(result);
  };

  return (
    <div className="container">
      <div className="row">
        <form className="col s12" onSubmit={onSubmitHandler}>
          <div className="row">
            <div className="input-field col s6">
              <i className="material-icons prefix">title</i>
              <input
                id="icon_prefix"
                value={todo.title}
                type="text"
                className="validate"
                onChange={(e) => setTodo({ ...todo, title: e.target.value })}
              />
              <label htmlFor="icon_prefix">Title</label>
            </div>
            <div className="input-field col s6">
              <i className="material-icons prefix">description</i>
              <input
                id="description"
                value={todo.content}
                type="tel"
                className="validate"
                onChange={(e) => setTodo({ ...todo, content: e.target.value })}
              />
              <label htmlFor="description">content</label>
            </div>
          </div>

          <div className="row right-align">
            <button className="waves-effect.waves-light btn">Save</button>
          </div>
        </form>
      </div>
      {!todos ? (
        <Preloader />
      ) : todos.length > 0 ? (
        <ul className="collection">
          {todos.map((todo) => (
            <li
              onClick={() => setCurrentId(todo._id)}
              key={todo._id}
              className="collection-item"
            >
              <div>
                <h5>{todo.title}</h5>
                <p>
                  {todo.content}
                  <a
                    onClick={() => removeTodo(todo._id)}
                    href="#!"
                    className="secondary-content"
                  >
                    <i className="material-icons">delete</i>
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h5>Nothing to do</h5>
        </div>
      )}
    </div>
  );
}

export default App;
