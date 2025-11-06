'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Project } from '@/lib/supabase';
import FormattedDescription from '@/app/components/FormattedDescription';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dayNumber, setDayNumber] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [techStack, setTechStack] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    checkAuth();
    fetchProjects();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDayNumber('');
    setProjectDate('');
    setTechStack('');
    setLiveLink('');
    setGithubLink('');
    setImageUrl('');
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = {
      title,
      description,
      day_number: dayNumber ? parseInt(dayNumber) : null,
      project_date: projectDate || null,
      tech_stack: techStack.split(',').map(t => t.trim()),
      live_link: liveLink || null,
      github_link: githubLink || null,
      image_url: imageUrl || null,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
      }

      resetForm();
      fetchProjects();
    } catch (error: any) {
      alert('Error saving project: ' + error.message);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setDayNumber(project.day_number ? project.day_number.toString() : '');
    setProjectDate(project.project_date || '');
    setTechStack(project.tech_stack.join(', '));
    setLiveLink(project.live_link || '');
    setGithubLink(project.github_link || '');
    setImageUrl(project.image_url || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error: any) {
      alert('Error deleting project: ' + error.message);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-10 md:px-10 container mx-auto max-w-7xl pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:from-sky-500 hover:to-blue-600 transition-all"
          >
            {showForm ? 'Cancel' : 'Add New Project'}
          </button>
          <button
            onClick={handleLogout}
            className="border-2 border-black bg-transparent text-black px-6 py-2 rounded-lg font-medium hover:bg-black hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Description *</label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-vibrant-accent hover:underline"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={10}
                    placeholder="Use markdown: **bold**, *italic*, `code`, ```code block```"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formatting: **bold** *italic* `inline code` ```code block``` | Double line break for paragraphs
                  </p>
                </div>
                
                {showPreview && (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                    <FormattedDescription 
                      text={description || 'Your formatted description will appear here...'}
                      className="text-base text-gray-800 dark:text-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Day Number (optional)</label>
              <input
                type="number"
                value={dayNumber}
                onChange={(e) => setDayNumber(e.target.value)}
                placeholder="1"
                min="1"
                max="30"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Project Date (optional)</label>
              <input
                type="date"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tech Stack (comma-separated) *</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                required
                placeholder="React, TypeScript, Tailwind CSS"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Live Link</label>
              <input
                type="url"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GitHub Link</label>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:from-sky-500 hover:to-blue-600 transition-all"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border-2 border-gray-300 bg-transparent px-6 py-2 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">All Projects ({projects.length})</h2>
        
        {projects.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No projects yet. Click "Add New Project" to create one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Tech Stack</th>
                  <th className="text-left py-3 px-4">Links</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4">{project.id}</td>
                    <td className="py-3 px-4 font-medium">{project.title}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="text-xs text-gray-500">+{project.tech_stack.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {project.live_link && (
                          <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                            Live
                          </a>
                        )}
                        {project.github_link && (
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                            GitHub
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
