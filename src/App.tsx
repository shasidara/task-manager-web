import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Task from "./components/Task";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import TaskList from "./components/TaskList";
import TaskDetail from "./components/TaskDetail";

function App() {

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<TaskList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/task" element={<Task />} />
              <Route path="/single/task/:id" element={<TaskDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>  
      </Provider>
      
    </>
  );
};

export default App
