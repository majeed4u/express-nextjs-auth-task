"use client";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api, TaskSchema } from "./tasks";
import { useMemo, useState } from "react";
import { PriorityTag, Priority } from "./PriorityTag";
import EditTaskModel from "./EditTaskModel";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronDown,
  Circle,
  Edit,
  Hash,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

export default function TaskApp() {
  // State to manage tasks
  const [editingTask, setEditingTask] = useState<TaskSchema | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>(
    0 as Priority
  );
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  // Get query client instance
  const queryClient = useQueryClient();
  // Fetch tasks using React Query
  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: api.fetchTasks,
  });
  // Mutation for creating a new task
  const addTaskMutation = useMutation({
    mutationFn: (taskData: TaskSchema) => api.createTask(taskData),
    onSuccess: () => {
      // Invalidate the tasks query to refetch tasks
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority(0);
    },
  });
  // Mutation for updating a task
  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      taskData,
    }: {
      taskId: string;
      taskData: TaskSchema;
    }) => api.updateTask(taskId, taskData),
    onMutate: async ({ taskId, taskData }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<TaskSchema[]>(["tasks"]);
      if (previousTasks) {
        queryClient.setQueryData<TaskSchema[]>(["tasks"], (oldTasks) =>
          oldTasks?.map((task) =>
            task.id === taskId ? { ...task, ...taskData } : task
          )
        );
      }
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  // Mutation for deleting a task
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => api.deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<TaskSchema[]>(["tasks"]);
      if (previousTasks) {
        queryClient.setQueryData<TaskSchema[]>(["tasks"], (oldTasks) =>
          oldTasks?.filter((task) => task.id !== taskId)
        );
      }
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Function to handle adding a new task
  const handleAddTask = (event: React.FormEvent) => {
    event.preventDefault();
    if (newTaskTitle.trim() === "") return;
    const newTask: TaskSchema = {
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newTaskPriority,
      completed: false,
    };
    addTaskMutation.mutate(newTask);
  };

  // Function to handle updating a task
  const handleUpdateTask = (task: TaskSchema) => {
    if (!editingTask) return;
    updateTaskMutation.mutate(
      { taskId: editingTask.id!, taskData: task },

      {
        onSuccess: () => {
          setEditingTask(null);
        },
      }
    );
  };

  // Function to handle deleting a task
  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  // toggle task completion
  const toggleTaskCompletion = (task: TaskSchema) => {
    updateTaskMutation.mutate(
      { taskId: task.id!, taskData: { ...task, completed: !task.completed } },
      {
        onSuccess: () => {
          setEditingTask(null);
        },
      }
    );
  };

  // Filter and sort tasks based on user selection
  const filteredAndSortedTasks = useMemo(() => {
    const safeTasks = tasks || [];
    // Define the return type for the filter and sort operation
    const result: TaskSchema[] = safeTasks
      .filter((task: TaskSchema) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true; // Show all tasks
      })
      .sort((a: TaskSchema, b: TaskSchema) => {
        if (sortBy === "priority") {
          return b.priority - a.priority; // High priority first
        }
        if (sortBy === "createdAt") {
          return (
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          ); // Newest first
        }
        return 0; // Default no sorting
      });

    return result;
  }, [tasks, filter, sortBy]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      {editingTask && (
        <EditTaskModel
          task={editingTask}
          onSave={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-slate-500 mt-1">Stay organized and productive.</p>
        </header>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-8">
          <form onSubmit={handleAddTask} className="space-y-4">
            {/* Input fields now in a vertical layout */}
            <div>
              <label htmlFor="newTaskTitle" className="sr-only">
                New task title
              </label>
              <input
                id="newTaskTitle"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task Title"
                className="w-full p-3 text-base bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="newTaskDescription" className="sr-only">
                New task description
              </label>
              <textarea
                id="newTaskDescription"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Add a description... (optional)"
                rows={2}
                className="w-full p-3 text-base bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Actions row */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <label htmlFor="newTaskPriority" className="sr-only">
                  Priority
                </label>
                <select
                  id="newTaskPriority"
                  value={newTaskPriority}
                  onChange={(e) =>
                    setNewTaskPriority(Number(e.target.value) as Priority)
                  }
                  className="appearance-none w-full cursor-pointer bg-slate-100 text-slate-700 font-medium py-3 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Low Priority</option>
                  <option value={1}>Medium Priority</option>
                  <option value={2}>High Priority</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button
                type="submit"
                disabled={addTaskMutation.isPending}
                className="w-full sm:flex-grow flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {addTaskMutation.isPending ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>
                  {addTaskMutation.isPending ? "Adding..." : "Add Task"}
                </span>
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-lg">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`capitalize px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === f
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-300/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none text-sm bg-white border border-slate-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20 gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin" />{" "}
            <span className="text-lg font-medium">Loading Tasks...</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-600 bg-red-50 border-red-200 rounded-2xl">
            <AlertCircle className="w-12 h-12" />
            <span className="text-lg font-semibold">{error.message}</span>
          </div>
        ) : filteredAndSortedTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white p-5 rounded-2xl shadow-sm border ${
                  task.completed
                    ? "opacity-60 bg-slate-50 border-slate-200/60"
                    : "border-slate-200/80 hover:shadow-md hover:-translate-y-1"
                } transition-all`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTaskCompletion(task)}
                    className="flex-shrink-0 mt-1 focus:outline-none rounded-full"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>
                  <div className="flex-grow">
                    <p
                      className={`font-semibold text-lg ${
                        task.completed
                          ? "line-through text-slate-500"
                          : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-slate-600 mt-1 text-sm">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5" />
                        <span>{task.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-3 ml-4">
                    <PriorityTag priority={task.priority as Priority} />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id!)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border">
            <h3 className="text-xl font-semibold">No tasks here!</h3>
            <p className="text-slate-500 mt-2">
              Add a new task to get started.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
