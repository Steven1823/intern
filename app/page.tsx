"use client"

import type React from "react"

import { useState } from "react"
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

export default function Page() {
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

    // Update task status
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "done" as const, completedAt: new Date() } : t)),
    )

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    const completionMessage = `🎉 Completed: ${task.title}`

    try {
      // Get settings from localStorage
      const slackWebhook = localStorage.getItem("micro.slackWebhook")
      const email = localStorage.getItem("micro.email")

      // Send Slack notification
      await fetch("/api/slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl: slackWebhook || undefined,
          text: completionMessage,
        }),
      })

      // Send email notification if email is configured
      if (email) {
        await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email,
            subject: "Task Completed!",
            text: `Congratulations! You've completed: ${task.title}`,
          }),
        })
      }
    } catch (error) {
      console.error("Failed to send notifications:", error)
    }
  }

  const markTodo = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "todo" as const, completedAt: undefined } : t)),
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
        <p className="text-green-600 dark:text-green-400 font-semibold">Done today: {doneToday}</p>
      </div>

      {/* Add new task */}
      <div className="bg-card rounded-lg p-6 space-y-4 border border-border">
        <h2 className="text-xl font-semibold">Add New Task</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            value={newTaskDue}
            onChange={(e) => setNewTaskDue(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={addTask}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
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
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-card rounded-lg p-4 border-l-4 border border-border hover:bg-accent/50 transition-colors ${
                task.status === "done" ? "border-l-green-500" : "border-l-blue-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </h3>
                  {task.due && (
                    <p className="text-sm text-muted-foreground mt-1">Due: {new Date(task.due).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {task.status === "todo" ? (
                    <button
                      onClick={() => markDone(task.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Done
                    </button>
                  ) : (
                    <button
                      onClick={() => markTodo(task.id)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Undo
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
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
