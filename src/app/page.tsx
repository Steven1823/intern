"use client"

import React, { useState } from "react"
import confetti from "canvas-confetti"

interface Task {
  id: string
  title: string
  due?: string
  status: "todo" | "done"
  createdAt: Date
  completedAt?: Date
}

type Filter = "all" | "todo" | "done"

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDue, setNewTaskDue] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  // Count tasks completed today
  const doneToday = tasks.filter((task) => {
    if (task.status !== "done" || !task.completedAt) return false
    const today = new Date().toDateString()
    return task.completedAt.toDateString() === today
  }).length

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    return task.status === filter
  })

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      due: newTaskDue || undefined,
      status: "todo",
      createdAt: new Date(),
    }

    setTasks((prev) => [...prev, newTask])
    setNewTaskTitle("")
    setNewTaskDue("")
  }

  const markDone = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "done", completedAt: new Date() }
          : t
      )
    )

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `🎉 Completed: ${task.title}` }),
      })
    } catch (error) {
      console.error("Failed to send Slack notification:", error)
    }
  }

  const markTodo = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "todo", completedAt: undefined }
          : t
      )
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask()
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold">Welcome to Micro-Milestone Celebrator!</h2>
        <p className="text-gray-300">Start celebrating your small wins 🚀</p>
      </section>

      {/* Done today counter */}
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
        <p className="text-green-400 font-semibold">Done today: {doneToday}</p>
      </div>

      {/* Add new task */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add New Task</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={newTaskDue}
            onChange={(e) => setNewTaskDue(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "todo", "done"] as Filter[]).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-md font-medium capitalize transition-colors ${
              filter === filterOption
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
                task.status === "done" ? "border-green-500" : "border-blue-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      task.status === "done" ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.due && !isNaN(Date.parse(task.due)) && (
                    <p className="text-sm text-gray-400 mt-1">
                      Due: {new Date(task.due).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {task.status === "todo" ? (
                    <button
                      onClick={() => markDone(task.id)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      onClick={() => markTodo(task.id)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Undo
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
