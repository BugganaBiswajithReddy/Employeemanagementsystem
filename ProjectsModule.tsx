import React, { useState, useMemo } from 'react';
import { Project, Employee, ProjectStatus } from '../types';
import { StorageService } from '../services/storage';
import { 
  Plus, Search, Edit2, Trash2, X, Briefcase, Calendar, Users, Filter, CheckCircle2, AlertCircle
} from 'lucide-react';

interface ProjectsModuleProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  employees: Employee[];
}

export const ProjectsModule: React.FC<ProjectsModuleProps> = ({ projects, setProjects, employees }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [sortBy, setSortBy] = useState<'Name' | 'StartDate' | 'EndDate' | 'CreatedDate'>('CreatedDate');

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.id?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'Name') return a.name.localeCompare(b.name);
        if (sortBy === 'StartDate') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        if (sortBy === 'EndDate') return new Date(a.expectedEndDate).getTime() - new Date(b.expectedEndDate).getTime();
        if (sortBy === 'CreatedDate') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return 0;
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      const updated = projects.filter(p => p.id !== projectToDelete.id);
      setProjects(updated);
      StorageService.saveProjects(updated);
      StorageService.deleteProject(projectToDelete.id);
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const saveProject = (projectData: Omit<Project, 'id' | 'createdAt'>, id?: string, createdAt?: string) => {
    if (id) {
      const updatedProject = { ...projectData, id, createdAt: createdAt! };
      const updated = projects.map(p => p.id === id ? updatedProject : p);
      setProjects(updated);
      StorageService.saveProjects(updated);
    } else {
      const newProject: Project = {
        ...projectData,
        id: `PRJ-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString()
      };
      const updated = [newProject, ...projects];
      setProjects(updated);
      StorageService.saveProjects(updated);
    }
    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
          <p className="text-sm text-slate-500 mt-1">Manage company projects and assignments</p>
        </div>
        <button type="button"
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors font-medium focus:ring-4 focus:ring-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>Create Project</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="All">All Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="CreatedDate">Sort by Created</option>
              <option value="Name">Sort by Name</option>
              <option value="StartDate">Sort by Start Date</option>
              <option value="EndDate">Sort by End Date</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Timeline</th>
                <th className="px-6 py-4 font-medium text-center">Team Size</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No projects found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => (
                  <tr key={project.id || `proj-${index}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{project.name}</div>
                          <div className="text-xs text-slate-500">ID: {project.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{project.startDate} to {project.expectedEndDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-lg text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{project.assignedEmployees?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button type="button"
                          onClick={() => handleOpenEdit(project)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button type="button"
                          onClick={() => handleOpenDelete(project)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <ProjectFormModal
          project={editingProject}
          employees={employees}
          onClose={() => setIsFormModalOpen(false)}
          onSave={saveProject}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Project?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete this project? This will remove all associated employee assignments. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ProjectFormModalProps {
  project: Project | null;
  employees: Employee[];
  onClose: () => void;
  onSave: (data: Omit<Project, 'id' | 'createdAt'>, id?: string, createdAt?: string) => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ project, employees, onClose, onSave }) => {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [expectedEndDate, setExpectedEndDate] = useState(project?.expectedEndDate || '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'Not Started');
  const [assignedIds, setAssignedIds] = useState<string[]>(project?.assignedEmployees || []);

  const [employeeSearch, setEmployeeSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'search' | 'department'>('search');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [error, setError] = useState('');

  const availableDepartments = useMemo(() => {
    return Array.from(new Set(employees.map(e => e.department))).filter(Boolean);
  }, [employees]);

  const availableEmployees = useMemo(() => {
    return employees.filter(e => {
      if (searchMode === 'search') {
        if (!employeeSearch) return false;
        const isMatch = e.name?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                        e.id?.toLowerCase().includes(employeeSearch.toLowerCase());
        return isMatch;
      } else {
        if (!selectedDepartment) return false;
        return e.department === selectedDepartment;
      }
    }); 
  }, [employees, employeeSearch, searchMode, selectedDepartment]);

  const assignedEmployeesData = useMemo(() => {
    return assignedIds.map(id => employees.find(e => e.id === id)).filter(Boolean) as Employee[];
  }, [assignedIds, employees]);

  const handleSave = () => {
    setError('');
    
    if (!name.trim()) {
      setError('Project Name is required.');
      return;
    }
    if (!startDate) {
      setError('Start Date is required.');
      return;
    }
    if (!expectedEndDate) {
      setError('Expected End Date is required.');
      return;
    }
    if (new Date(startDate) > new Date(expectedEndDate)) {
      setError('Start Date cannot be later than Expected End Date.');
      return;
    }
    if (assignedIds.length === 0) {
      setError('At least one employee must be assigned to the project.');
      return;
    }

    onSave({
      name,
      description,
      startDate,
      expectedEndDate,
      status,
      assignedEmployees: assignedIds,
    }, project?.id, project?.createdAt);
  };

  const addEmployee = (id: string) => {
    if (!assignedIds?.includes(id)) {
      setAssignedIds([...assignedIds, id]);
    }
  };

  const removeEmployee = (id: string) => {
    setAssignedIds(assignedIds.filter(aId => aId !== id));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">
            {project ? 'Edit Project' : 'Create New Project'}
          </h3>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl flex items-center space-x-2 text-sm border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="e.g. Website Redesign"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows={3}
                  placeholder="Brief description of the project scope..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected End Date *</label>
                <input
                  type="date"
                  value={expectedEndDate}
                  onChange={(e) => setExpectedEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Assign Employees *</h4>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setSearchMode('search')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${searchMode === 'search' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMode('department')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${searchMode === 'department' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                  >
                    Department Filter
                  </button>
                </div>

                {searchMode === 'search' ? (
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employees by name or ID to assign..."
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="mb-2">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                    >
                      <option value="">Select a Department</option>
                      {availableDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {((searchMode === 'search' && employeeSearch) || (searchMode === 'department' && selectedDepartment)) && availableEmployees.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-lg shadow-sm divide-y divide-slate-100 max-h-64 overflow-y-auto mb-2">
                    {availableEmployees.map(emp => {
                      const isAssigned = assignedIds?.includes(emp.id);
                      return (
                        <div key={emp.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="text-sm">
                            <span className="font-medium text-slate-900">{emp.name}</span>
                            <span className="text-slate-500 ml-2 text-xs">({emp.id})</span>
                            <div className="text-slate-500 text-xs mt-0.5">{emp.designation} • {emp.department}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => !isAssigned && addEmployee(emp.id)}
                            disabled={isAssigned}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              isAssigned
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            {isAssigned ? 'Assigned' : 'Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {searchMode === 'search' && employeeSearch && availableEmployees.length === 0 && (
                  <div className="text-sm text-slate-500 p-2 text-center bg-white border border-slate-200 rounded-lg mb-2">
                    No matching employees found.
                  </div>
                )}
                {searchMode === 'department' && selectedDepartment && availableEmployees.length === 0 && (
                  <div className="text-sm text-slate-500 p-2 text-center bg-white border border-slate-200 rounded-lg mb-2">
                    No employees found in this department.
                  </div>
                )}
              </div>

              <div>
                <h5 className="text-sm font-medium text-slate-700 mb-2">Assigned Employees ({assignedEmployeesData.length})</h5>
                {assignedEmployeesData.length === 0 ? (
                  <div className="text-sm text-slate-500 italic p-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-center">
                    No employees assigned yet. Search and add employees above.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    {assignedEmployeesData.map(emp => (
                      <div key={emp.id} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-xs">
                            {emp.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 flex items-center space-x-2">
                              <span>{emp.name}</span>
                              <span className="text-xs text-slate-500">#{emp.id}</span>
                            </div>
                            <div className="text-xs text-slate-500">{emp.designation} • {emp.department}</div>
                          </div>
                        </div>
                        <button type="button"
                          onClick={() => removeEmployee(emp.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="Remove from project"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
          <button type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-xl transition-colors focus:ring-4 focus:ring-blue-500/20"
          >
            {project ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};
