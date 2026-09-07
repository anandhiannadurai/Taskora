import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Play, Pause, RotateCcw, Timer, CheckCircle, Zap, Target, Sparkles, Award } from 'lucide-react';

export const FocusMode = () => {
  const { addToast } = useNotification();
  const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds

  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [activeTask, setActiveTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [completedSessions, setCompletedSessions] = useState(2);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(50);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.tasks.getAll({ status: 'In Progress' });
        if (res.success && res.tasks.length > 0) {
          setTaskList(res.tasks);
          setActiveTask(res.tasks[0].title);
        }
      } catch (err) {
        console.error('Failed to load tasks for focus mode:', err);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCompletedSessions((prev) => prev + 1);
      setTotalFocusMinutes((prev) => prev + 25);
      addToast('🎉 Focus Sprint Completed! Take a 5-minute break.', 'success');
      setTimeLeft(FOCUS_DURATION);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive) {
      addToast(`Focus session started on "${activeTask || 'Sprint Task'}"`, 'info');
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(FOCUS_DURATION);
    addToast('Timer reset to 25:00', 'info');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((FOCUS_DURATION - timeLeft) / FOCUS_DURATION) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              Focus Mode Sprint Engine
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold uppercase">
                25 Min Pomodoro
              </span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Eliminate distractions and execute deep work sessions bound to your active sprint tasks
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-2xl border border-emerald-500/20">
          <Sparkles className="w-4 h-4" /> Deep Work Active
        </div>
      </div>

      {/* Main Focus Timer Card */}
      <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-gray-900 via-[#111827] to-gray-900 text-white border border-gray-800 shadow-2xl space-y-8 text-center">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Task Selector Dropdown */}
        <div className="max-w-md mx-auto space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
            Current Active Task Selection:
          </label>
          {taskList.length > 0 ? (
            <select
              value={activeTask}
              onChange={(e) => setActiveTask(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gray-800/90 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
            >
              {taskList.map((t) => (
                <option key={t.id} value={t.title}>
                  🎯 {t.title}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={activeTask}
              onChange={(e) => setActiveTask(e.target.value)}
              placeholder="Type active task name..."
              className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gray-800/90 text-white border border-gray-700 focus:border-brand-500 focus:outline-none"
            />
          )}
        </div>

        {/* Big Timer Display & Progress Bar */}
        <div className="space-y-4 py-4">
          <div className="text-6xl sm:text-8xl font-black tracking-tight text-gradient font-mono">
            {formatTime(timeLeft)}
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden p-0.5 border border-gray-700">
              <div className="bg-gradient-brand h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
              <span>00:00</span>
              <span>{progressPercent}% Complete</span>
              <span>25:00</span>
            </div>
          </div>
        </div>

        {/* Controls: Play, Pause, Reset */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl text-sm font-extrabold shadow-brand transition-all transform hover:scale-105 flex items-center gap-2 ${
              isActive
                ? 'bg-amber-500 text-gray-900 hover:bg-amber-400'
                : 'bg-gradient-brand text-white hover:opacity-95'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            {isActive ? 'Pause Focus Session' : 'Start Focus Session'}
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Focus Telemetry Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Completed Sessions</span>
          <div className="text-3xl font-black text-brand-500 flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-brand-500" /> {completedSessions}
          </div>
          <p className="text-[11px] text-gray-400">25-minute Pomodoros today</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Focus Time</span>
          <div className="text-3xl font-black text-emerald-500 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-emerald-500" /> {totalFocusMinutes} Mins
          </div>
          <p className="text-[11px] text-emerald-500 font-semibold">+50 mins deep work</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-800 shadow-soft space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Focus Score</span>
          <div className="text-3xl font-black text-purple-500 flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-purple-500" /> 96%
          </div>
          <p className="text-[11px] text-purple-500 font-semibold">Zero distraction interrupts</p>
        </div>
      </div>
    </div>
  );
};
