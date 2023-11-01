"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  descShowed: boolean;
  completed: boolean;
  isEditing: boolean;
}

function NewTodoForm() {
  const [task, setTask] = useState("");
  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const localValue = localStorage.getItem("ITEMS");
      if (localValue == null) return [];
      else return JSON.parse(localValue);
    }
  }); //Saving value of tasks to a local storage
  const textAreaValue = useRef<HTMLTextAreaElement>(null);

  //Saving data to a local storage
  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(allTasks));
  }, [allTasks]);

  //Adding value to task variable
  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setTask(e.target.value);
  };

  //Adding new todo
  const handleSubmit = () => {
    if (task !== "") {
      setAllTasks((currentTasks) => {
        return [
          ...currentTasks,
          {
            id: crypto.randomUUID(),
            title: task,
            description: "Write here your description!",
            descShowed: false,
            completed: false,
            isEditing: false,
          },
        ];
      });
      setTask(""); //Clearing out input value
    }
  };

  //Togling todo finished/unfinished
  function toggleTodo(id: string, completed: boolean) {
    const descShowed: boolean = false;

    setAllTasks((currentTasks) => {
      return currentTasks.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed, descShowed }; //Odwołujemy się do konkretnej nazwy atrybutu
        }

        return todo;
      });
    });
  }

  //Togling editing on/off
  function toggleEditing(id: string, isEditing: boolean) {
    setAllTasks((currentTasks) => {
      return currentTasks.map((todo) => {
        if (todo.id === id) {
          if (todo.isEditing) {
            if (textAreaValue.current) {
              changeDescription(todo.id, textAreaValue.current.value);
            }
            return { ...todo, isEditing };
          } else return { ...todo, isEditing };
        } else return todo;
      });
    });
  }

  //Togling description on/off
  function toggleDescription(id: string, descShowed: boolean) {
    setAllTasks((currentTasks) => {
      return currentTasks.map((todo) => {
        if (todo.id === id) {
          return { ...todo, descShowed };
        }

        return todo;
      });
    });
  }

  //Deleting todo
  function deleteTodo(id: string) {
    setAllTasks((currentTasks) => {
      return currentTasks.filter((todo) => todo.id !== id);
    });
  }

  //Changing description to a value from text area
  function changeDescription(id: string, newDescription: string) {
    const description = newDescription;
    setAllTasks((currentTasks) => {
      return currentTasks.map((todo) => {
        if (todo.id === id) {
          return { ...todo, description };
        }

        return todo;
      });
    });
  }

  //Showing description
  function Description(props: {
    id: string;
    isEnabled: boolean;
    isMarked: boolean;
    textContent: string;
    isEditing: boolean;
  }) {
    const id = props.id;
    const isEnabled = props.isEnabled;
    const isMarked = props.isMarked;
    const textContent = props.textContent;
    const isEditing = props.isEditing;

    const normal = (
      <>
        <p>
          {textContent.length === 0
            ? "Write here your description!"
            : textContent}
        </p>
        <button
          onClick={() => toggleEditing(id, !isEditing)}
          className="float-right mr-1 underline opacity-50"
        >
          Change
        </button>
      </>
    );

    const editable = (
      <>
        <textarea
          ref={textAreaValue}
          defaultValue={
            textContent.length === 0
              ? "Write here your description!"
              : textContent
          }
          className="outline-none"
          rows={4}
          cols={50}
        />
        <button
          onClick={() => toggleEditing(id, !isEditing)}
          className="float-right mr-1 underline opacity-50"
        >
          Submit
        </button>
      </>
    );

    if (isEnabled && !isMarked) {
      return (
        <div className="relative text-left p-2 w-[30rem] border border-black border-t-0 rounded-sm">
          {isEditing ? editable : normal}
        </div>
      );
    }
  }

  //Our return
  return (
    <>
      {/**Input Div*/}
      <div className="border border-black p-[0.5rem] rounded-sm">
        <input
          type="text"
          id="task"
          placeholder="Write your task here!"
          className="placeholder-black placeholder-opacity-80 border border-black p-1 pl-2 mr-2 w-5/6 focus:outline-none"
          onChange={handleChange}
          value={task}
          maxLength={32}
        />
        <button className="border border-black p-1" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      {/**Results Div*/}
      <div className="flex justify-center">
        <div className="w-[31rem]">
          {Array.isArray(allTasks) === false
            ? "Loading your tasks!..."
            : allTasks.map((todo) => {
                return (
                  <>
                    <li
                      key={todo.id}
                      className={
                        todo.completed
                          ? "list-none text-left mt-2 p-2 border border-black rounded-sm opacity-40 relative truncate"
                          : "list-none text-left mt-2 p-2 border border-black rounded-sm relative truncate hover:bg-slate-50"
                      }
                    >
                      <label>
                        <input
                          type="checkbox"
                          defaultChecked={todo.completed}
                          onChange={(e) =>
                            toggleTodo(todo.id, e.target.checked)
                          }
                          className="mr-2 checked:bg-green-400"
                        />
                        {todo.title}
                      </label>
                      {/**Delete button */}
                      <button
                        className="absolute right-0 mr-2 underline"
                        onClick={() => deleteTodo(todo.id)}
                        disabled={todo.completed ? true : false}
                      >
                        delete
                      </button>
                      {/**Show more button */}
                      <button
                        className="absolute right-0 mr-[4.25rem] underline"
                        onClick={() =>
                          toggleDescription(todo.id, !todo.descShowed)
                        }
                        disabled={todo.completed ? true : false}
                      >
                        {todo.descShowed && !todo.completed ? "less" : "show"}
                      </button>
                    </li>
                    {/**Description showed?*/}
                    <div className="flex justify-center">
                      <Description
                        id={todo.id}
                        isEnabled={todo.descShowed}
                        isMarked={todo.completed}
                        textContent={todo.description}
                        isEditing={todo.isEditing}
                      />
                    </div>
                  </>
                );
              })}
        </div>
      </div>
    </>
  );
}

export default NewTodoForm;
