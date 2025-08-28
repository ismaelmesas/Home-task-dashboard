import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, Calendar, Home, ChefHat, Bath, Bed, Sofa, Car, TreePine, Settings, Filter, Plus, X, Trash2 } from 'lucide-react';

const HomeTasks = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    zone: 'kitchen',
    frequency: 'daily',
    priority: 'medium',
    icon: '🧽',
    estimatedTime: 15
  });

  // Datos iniciales de tareas
  const initialTasks = [
    // Cocina
    { id: 1, title: 'Limpiar encimeras', zone: 'kitchen', frequency: 'daily', priority: 'high', lastDone: null, icon: '🧽', estimatedTime: 10 },
    { id: 2, title: 'Lavar platos', zone: 'kitchen', frequency: 'daily', priority: 'high', lastDone: null, icon: '🍽️', estimatedTime: 15 },
    { id: 3, title: 'Limpiar horno', zone: 'kitchen', frequency: 'weekly', priority: 'medium', lastDone: null, icon: '🔥', estimatedTime: 30 },
    { id: 4, title: 'Organizar despensa', zone: 'kitchen', frequency: 'weekly', priority: 'low', lastDone: null, icon: '📦', estimatedTime: 20 },
    { id: 5, title: 'Limpiar nevera', zone: 'kitchen', frequency: 'weekly', priority: 'medium', lastDone: null, icon: '❄️', estimatedTime: 25 },
    
    // Baño
    { id: 6, title: 'Limpiar inodoro', zone: 'bathroom', frequency: 'daily', priority: 'high', lastDone: null, icon: '🚽', estimatedTime: 10 },
    { id: 7, title: 'Limpiar ducha', zone: 'bathroom', frequency: 'weekly', priority: 'high', lastDone: null, icon: '🚿', estimatedTime: 20 },
    { id: 8, title: 'Limpiar espejos', zone: 'bathroom', frequency: 'weekly', priority: 'medium', lastDone: null, icon: '🪞', estimatedTime: 5 },
    { id: 9, title: 'Cambiar toallas', zone: 'bathroom', frequency: 'weekly', priority: 'medium', lastDone: null, icon: '🏖️', estimatedTime: 5 },
    
    // Dormitorio
    { id: 10, title: 'Hacer la cama', zone: 'bedroom', frequency: 'daily', priority: 'medium', lastDone: null, icon: '🛏️', estimatedTime: 5 },
    { id: 11, title: 'Organizar closet', zone: 'bedroom', frequency: 'weekly', priority: 'low', lastDone: null, icon: '👕', estimatedTime: 30 },
    { id: 12, title: 'Aspirar habitación', zone: 'bedroom', frequency: 'weekly', priority: 'medium', lastDone: null, icon: '🌪️', estimatedTime: 15 },
    
    // Sala
    { id: 13, title: 'Aspirar sofás', zone: 'living', frequency: 'weekly', priority: 'medium', lastDone: null, icon: '🛋️', estimatedTime: 15 },
    { id: 14, title: 'Limpiar TV', zone: 'living', frequency: 'weekly', priority: 'low', lastDone: null, icon: '📺', estimatedTime: 5 },
    { id: 15, title: 'Ordenar mesa de centro', zone: 'living', frequency: 'daily', priority: 'low', lastDone: null, icon: '🪑', estimatedTime: 5 },
    
    // Jardín
    { id: 16, title: 'Regar plantas', zone: 'garden', frequency: 'daily', priority: 'medium', lastDone: null, icon: '💧', estimatedTime: 10 },
    { id: 17, title: 'Cortar césped', zone: 'garden', frequency: 'weekly', priority: 'medium', lastDone: null, icon: '🌱', estimatedTime: 45 },
  ];

  useEffect(() => {
    setTasks(initialTasks);
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Actualizar cada minuto
    return () => clearInterval(timer);
  }, []);

  const zones = [
    { id: 'all', name: 'Todas las Zonas', icon: Home, color: 'bg-slate-600', count: tasks.length },
    { id: 'kitchen', name: 'Cocina', icon: ChefHat, color: 'bg-orange-500', count: tasks.filter(t => t.zone === 'kitchen').length },
    { id: 'bathroom', name: 'Baño', icon: Bath, color: 'bg-blue-500', count: tasks.filter(t => t.zone === 'bathroom').length },
    { id: 'bedroom', name: 'Dormitorio', icon: Bed, color: 'bg-purple-500', count: tasks.filter(t => t.zone === 'bedroom').length },
    { id: 'living', name: 'Sala', icon: Sofa, color: 'bg-green-500', count: tasks.filter(t => t.zone === 'living').length },
    { id: 'garden', name: 'Jardín', icon: TreePine, color: 'bg-emerald-600', count: tasks.filter(t => t.zone === 'garden').length },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    return colors[priority] || 'bg-gray-500 text-white';
  };

  const getTasksDue = () => {
    return tasks.filter(task => {
      if (task.lastDone === null) return true;
      const daysSinceLastDone = Math.floor((currentDate - new Date(task.lastDone)) / (1000 * 60 * 60 * 24));
      return (task.frequency === 'daily' && daysSinceLastDone >= 1) ||
             (task.frequency === 'weekly' && daysSinceLastDone >= 7);
    });
  };

  const completeTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, lastDone: new Date().toISOString() } : task
    ));
  };

  const filteredTasks = getTasksDue()
    .filter(task => selectedZone === 'all' || task.zone === selectedZone)
    .filter(task => filterPriority === 'all' || task.priority === filterPriority);

  const totalTimeNeeded = filteredTasks.reduce((total, task) => total + task.estimatedTime, 0);
  const urgentTasks = filteredTasks.filter(task => task.priority === 'high').length;

  // Iconos disponibles para tareas
  const taskIcons = [
    '🧽', '🍽️', '🔥', '📦', '❄️', '🚽', '🚿', '🪞', '🏖️', '🛏️', 
    '👕', '🌪️', '🛋️', '📺', '🪑', '💧', '🌱', '🧹', '🧼', '🪣',
    '✨', '🧴', '🧽', '🔧', '⚙️', '🪛', '📚', '🗂️', '💡', '🔌'
  ];

  // Función para añadir nueva tarea
  const addNewTask = () => {
    const newId = Math.max(...tasks.map(t => t.id)) + 1;
    const taskToAdd = {
      ...newTask,
      id: newId,
      lastDone: null
    };
    setTasks([...tasks, taskToAdd]);
    setNewTask({
      title: '',
      zone: 'kitchen',
      frequency: 'daily',
      priority: 'medium',
      icon: '🧽',
      estimatedTime: 15
    });
    setShowAddTaskModal(false);
  };

  // Función para eliminar tarea
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Panel de Tareas del Hogar
                </h1>
                <p className="text-gray-600 text-sm">
                  {currentDate.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 px-3 py-2 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800 font-semibold">{urgentTasks} urgentes</span>
              </div>
              <div className="bg-indigo-100 px-3 py-2 rounded-lg flex items-center space-x-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span className="text-indigo-800 font-semibold">{totalTimeNeeded} min</span>
              </div>
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Nueva Tarea</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Zones Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {zones.map((zone) => {
            const IconComponent = zone.icon;
            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedZone === zone.id ? 'ring-4 ring-indigo-300' : ''
                }`}
              >
                <div className={`${zone.color} rounded-xl p-4 text-white shadow-lg hover:shadow-xl`}>
                  <div className="flex flex-col items-center text-center">
                    <IconComponent className="h-8 w-8 mb-2" />
                    <h3 className="font-semibold text-sm">{zone.name}</h3>
                    <div className="bg-white bg-opacity-20 rounded-full px-2 py-1 mt-2">
                      <span className="text-xs font-bold">{zone.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Filtros:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Todas las prioridades</option>
                <option value="high">Alta prioridad</option>
                <option value="medium">Prioridad media</option>
                <option value="low">Baja prioridad</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Mostrando {filteredTasks.length} tareas pendientes
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${
                task.priority === 'high' ? 'border-l-red-500' : 
                task.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{task.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{task.title}</h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {zones.find(z => z.id === task.zone)?.name}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(task.priority)}`}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {task.frequency === 'daily' ? 'Diario' : 'Semanal'}
                    </span>
                    <span className="text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {task.estimatedTime} min
                    </span>
                  </div>

                  <div className="pt-3 border-t">
                    <button
                      onClick={() => completeTask(task.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg mb-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Marcar Completa</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Excelente trabajo!
            </h3>
            <p className="text-gray-600">
              {selectedZone === 'all' 
                ? 'No hay tareas pendientes en este momento'
                : `No hay tareas pendientes en ${zones.find(z => z.id === selectedZone)?.name}`
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal para añadir nueva tarea */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Nueva Tarea
                </h2>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Formulario */}
              <div className="space-y-6">
                {/* Título de la tarea */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título de la tarea
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Ej. Limpiar ventanas"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Zona */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zona del hogar
                  </label>
                  <select
                    value={newTask.zone}
                    onChange={(e) => setNewTask({ ...newTask, zone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    <option value="kitchen">🍳 Cocina</option>
                    <option value="bathroom">🛁 Baño</option>
                    <option value="bedroom">🛏️ Dormitorio</option>
                    <option value="living">🛋️ Sala</option>
                    <option value="garden">🌿 Jardín</option>
                  </select>
                </div>

                {/* Frecuencia */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Frecuencia
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewTask({ ...newTask, frequency: 'daily' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newTask.frequency === 'daily'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <Calendar className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-sm font-semibold">Diario</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTask({ ...newTask, frequency: 'weekly' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newTask.frequency === 'weekly'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <Calendar className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-sm font-semibold">Semanal</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Prioridad */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nivel de prioridad
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewTask({ ...newTask, priority: 'high' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newTask.priority === 'high'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <AlertCircle className="h-5 w-5 mx-auto mb-1 text-red-500" />
                        <span className="text-xs font-semibold">Alta</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTask({ ...newTask, priority: 'medium' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newTask.priority === 'medium'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <AlertCircle className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                        <span className="text-xs font-semibold">Media</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewTask({ ...newTask, priority: 'low' })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newTask.priority === 'low'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <AlertCircle className="h-5 w-5 mx-auto mb-1 text-green-500" />
                        <span className="text-xs font-semibold">Baja</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tiempo estimado */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiempo estimado (minutos)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={newTask.estimatedTime}
                      onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="bg-indigo-100 px-3 py-2 rounded-lg min-w-[80px] text-center">
                      <span className="text-indigo-800 font-semibold">{newTask.estimatedTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Selector de icono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Icono de la tarea
                  </label>
                  <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {taskIcons.map((icon, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewTask({ ...newTask, icon })}
                        className={`p-2 rounded-lg text-xl transition-all hover:bg-gray-100 ${
                          newTask.icon === icon ? 'bg-indigo-100 ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vista previa */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Vista previa:</h3>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xl">{newTask.icon}</span>
                      <span className="font-semibold text-gray-800">{newTask.title || 'Título de tarea'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(newTask.priority)}`}>
                        {newTask.priority === 'high' ? 'Alta' : newTask.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{newTask.frequency === 'daily' ? 'Diario' : 'Semanal'}</span>
                      <span>{newTask.estimatedTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddTaskModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addNewTask}
                    disabled={!newTask.title.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                  >
                    Crear Tarea
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progress Indicator */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-white rounded-full shadow-lg p-4 border-4 border-indigo-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round(((tasks.length - getTasksDue().length) / tasks.length) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Completado</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTasks;