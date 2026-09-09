/**
 * Business Communication OS - Tasks View
 * Feature IDs: SYS-004, UI-001, UI-016
 */

import React, { useState } from 'react';
import { CheckSquare, Plus, CheckCircle2, Circle, Clock, Tag } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/common/EmptyState';
import { PriorityBadge, TaskStatusBadge } from '../components/common/StatusBadge';
import { useLanguage } from '../i18n/LanguageContext';
import { Task, TaskPriority, TaskSourceType } from '../types/domain';
import { INITIAL_TASKS } from '../persistence/repositories';

export const TasksView: React.FC = () => {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('MEDIUM');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
        return {
          ...task,
          status: nextStatus,
          completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Task = {
      id: `tsk-${Date.now()}`,
      userId: 'usr-default',
      title: newTitle,
      description: newDescription,
      status: 'TODO',
      priority: newPriority,
      dueDate: newDueDate,
      sourceType: 'MANUAL',
      tags: ['Manual'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks(prev => [created, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  return (
    <div id="view-tasks" className="space-y-6">
      <PageHeader
        id="tasks-header"
        title={t.tasksTitle}
        description="Actionable tasks harmonized from email correspondence, meetings, AI recommendations, and manual entries."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.tasksNewTask}</span>
          </button>
        }
      />

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              {t.tasksNewTask}
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Optional details or context"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg shadow-xs cursor-pointer"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={t.tasksNoTasks}
          description={t.tasksNoTasksDesc}
          actionLabel={t.tasksNewTask}
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
          {tasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            return (
              <div
                key={task.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  isCompleted ? 'bg-neutral-50/60 dark:bg-neutral-900/40 opacity-70' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                    aria-label="Toggle task status"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0">
                    <p className={`text-xs font-semibold ${isCompleted ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-neutral-400">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-medium">
                        Source: {task.sourceType}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>Due: {task.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <TaskStatusBadge status={task.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
