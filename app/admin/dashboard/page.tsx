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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Text formatting helpers
  const insertFormatting = (prefix: string, suffix: string = '', placeholder: string = 'text') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);
    const textToInsert = selectedText || placeholder;

    const newText =
      description.substring(0, start) +
      prefix + textToInsert + suffix +
      description.substring(end);

    setDescription(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Handle image insertion into description
  const handleDescriptionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const imageMarkdown = `![${file.name}](${base64Image})`;

        const newText =
          description.substring(0, start) +
          imageMarkdown +
          description.substring(start);

        setDescription(newText);

        // Reset cursor position
        setTimeout(() => {
          textarea.focus();
          const newCursorPos = start + imageMarkdown.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again
    e.target.value = '';
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
    setImageFile(null);
    setImagePreview('');
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use image preview (base64) if file was uploaded, otherwise use imageUrl
    const finalImageUrl = imagePreview || imageUrl || null;

    const projectData = {
      title,
      description,
      day_number: dayNumber ? parseInt(dayNumber) : null,
      project_date: projectDate || null,
      tech_stack: techStack.split(',').map(t => t.trim()),
      live_link: liveLink || null,
      github_link: githubLink || null,
      image_url: finalImageUrl,
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
    setImageFile(null);
    setImagePreview('');
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

              <div className="space-y-4">
                <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-background-dark">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 flex-wrap">
                    <button
                      type="button"
                      onClick={() => insertFormatting('# ', '', 'Heading 1')}
                      className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-sm font-semibold"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ', '', 'Heading 2')}
                      className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-sm font-semibold"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**', 'bold')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Bold"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*', 'italic')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Italic"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="19" y1="4" x2="10" y2="4" strokeWidth={2} strokeLinecap="round" />
                        <line x1="14" y1="20" x2="5" y2="20" strokeWidth={2} strokeLinecap="round" />
                        <line x1="15" y1="4" x2="9" y2="20" strokeWidth={2} strokeLinecap="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('`', '`', 'code')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Inline Code"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('```\n', '\n```', 'code block')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Code Block"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l-2 2 2 2m6-4l2 2-2 2" />
                      </svg>
                    </button>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <label className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer" title="Insert Image">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
                        <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15l-5-5L5 21" />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDescriptionImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n\n', '', '')}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Line Break"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 6h16M4 18h7" />
                      </svg>
                    </button>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={10}
                    placeholder="Write text here ..."
                    className="w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-background-dark text-base resize-none border-0"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use toolbar buttons for formatting or type manually: **bold** *italic* `code` ```code block```
                </p>

                {showPreview && (
                  <div className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
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
                className="w-full  px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vibrant-accent outline-none bg-white dark:bg-background-dark"
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

            <div className="space-y-4">
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

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium">Or Upload Image</label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">(JPG, PNG, GIF - Max 5MB)</span>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-vibrant-accent transition-colors text-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {(imagePreview || imageUrl) && (
                    <div className="flex-shrink-0">
                      <img
                        src={imagePreview || imageUrl}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Note: Uploaded images will be converted to base64 and stored in the database. For production, consider using a proper image hosting service.
                </p>
              </div>
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
                          <span key={i} className="text-xs bg-white border border-black text-black px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="text-xs text-black">+{project.tech_stack.length - 3}</span>
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
