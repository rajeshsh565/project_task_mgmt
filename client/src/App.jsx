import { Routes, Route, Link } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import ProjectView from "./components/ProjectView";
import EditProjectModal from "./components/EditProjectModal";
import EditTaskModal from "./components/EditTaskModal";
import ProjectSelector from "./components/ProjectSelector";
import { CreateProjectIcon, CreateTaskIcon } from "./utils/icons.jsx";
import { useAppContext } from "./context/AppContext";

function App() {
  const { onProjectListPage, handleEditProject, handleCreateTask, projects } = useAppContext();

  return (
    <div className="bg-gray-900 text-white h-screen font-sans">
      <div className="flex flex-col container mx-auto p-4 md:p-8 h-full">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-8">
          <div className="border-b-4 border-[rebeccapurple] shadow-lg shadow-black px-4 pb-2 rounded-xl">
            <Link to="/">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-0 text-center">
                Project & Task Management
              </h1>
            </Link>
          </div>
          {projects &&
            projects?.length > 0 &&
            (onProjectListPage ? (
              <button
                onClick={() => handleEditProject(null)}
                className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 md:px-4 rounded cursor-pointer`}
              >
                <CreateProjectIcon />
                <span className="ml-2 inline">Create Project</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <ProjectSelector />
                <button
                  onClick={() => handleEditProject(null)}
                  className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 md:px-4 rounded cursor-pointer`}
                >
                  <CreateProjectIcon />
                  <span className="ml-2 hidden sm:inline">Create Project</span>
                </button>
                <button
                  onClick={() => handleCreateTask(null)}
                  className={`flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 md:px-4 rounded cursor-pointer`}
                >
                  <CreateTaskIcon />
                  <span className="ml-2 hidden sm:inline">Create Task</span>
                </button>
              </div>
            ))}
        </header>

        <main className="grow">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/project/:id" element={<ProjectView />} />
          </Routes>
        </main>

        <EditProjectModal />
        <EditTaskModal />

      </div>
    </div>
  );
}

export default App;
