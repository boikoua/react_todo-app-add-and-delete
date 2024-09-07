/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import Header from './components/Header';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filterValue, setFilterValue] = useState<Filter>(Filter.All);

  useEffect(() => {
    todoService
      .getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage('Unable to load todos'));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterValue) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filterValue]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  // DeletePost function
  const deleteTodo = (todoId: number) => {
    todoService.deleteTodo(todoId);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header todos={todos} />
        <TodoList todos={filteredTodos} deleteTodo={deleteTodo} />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterValue={filterValue}
            onClickFilter={setFilterValue}
            deleteTodo={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
