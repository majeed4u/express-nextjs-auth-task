"use client";
import { useState } from "react";
import { TaskSchema } from "./tasks";
import { Loader2, X } from "lucide-react";

interface EditTaskModelProps {
  task: TaskSchema;
  onSave: (task: TaskSchema) => void;
  onCancel: () => void;
}

export default function EditTaskModel({
  task,
  onSave,
  onCancel,
}: EditTaskModelProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    await onSave({
      ...task,
      title,
      description,
      priority,
    });
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Edit Task</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="editTitle"
                className="text-sm font-medium text-slate-600 mb-1 block"
              >
                Title
              </label>
              <input
                id="editTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-base bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="editDescription"
                className="text-sm font-medium text-slate-600 mb-1 block"
              >
                Description
              </label>
              <textarea
                id="editDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 text-base bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="editPriority"
                className="text-sm font-medium text-slate-600 mb-1 block"
              >
                Priority
              </label>
              <select
                id="editPriority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full p-3 text-base bg-slate-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 px-6 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-2 w-32 bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
