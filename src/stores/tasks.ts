import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Task {
  id: string
  title: string
  done: boolean
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchTasks() {
    try {
      const res = await fetch('http://localhost:4000/tasks')
      tasks.value = await res.json()
    } catch {
      error.value = 'Erreur chargement'
    } finally {
      loading.value = false
    }
  }

  async function addTask(title: string) {
    const res = await fetch('http://localhost:4000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, done: false }),
    })
    tasks.value.push(await res.json())
  }

  async function deleteTask(id: string) {
    await fetch('http://localhost:4000/tasks/' + id, { method: 'DELETE' })
    tasks.value = tasks.value.filter((task) => task.id !== id)
  }

  async function toggleTask(task: Task) {
    const res = await fetch('http://localhost:4000/tasks/' + task.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, done: !task.done }),
    })
    const data = await res.json()
    const index = tasks.value.findIndex((item) => item.id === data.id)
    tasks.value[index] = data
  }

  return { tasks, loading, error, fetchTasks, addTask, deleteTask, toggleTask }
})
