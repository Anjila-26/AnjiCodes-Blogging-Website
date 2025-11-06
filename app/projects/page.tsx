'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase, Project } from '@/lib/supabase';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
      
      // Keep loading screen for minimum 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const projectCards = document.querySelectorAll('.project-card');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    projectCards.forEach((card) => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [projects]);

  if (loading) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center bg-white">
        <img 
          src="/cat-running.gif" 
          alt="Loading..." 
          className="w-64 h-64 object-contain"
        />
      </main>
    );
  }

  return (
    <main className="pt-24 flex-grow opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-7xl">
        <div className="py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black mb-4 transform transition-all duration-500 hover:scale-105">
            All Projects
          </h1>
          <p className="text-lg md:text-xl text-subtext-light max-w-3xl">
            Building one project every day for 30 days. Each project teaches me something new.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="py-20">
            <p className="text-xl text-gray-600">
              No projects yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="project-card group block bg-white border-2 border-black rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Project Image */}
                {project.image_url && (
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  {/* Day Badge */}
                  {project.day_number && (
                    <div className="inline-block">
                      <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                        Day {project.day_number}
                      </span>
                    </div>
                  )}
                  
                  {/* Title */}
                  <h3 className="text-2xl font-black tracking-tight text-black leading-tight group-hover:text-vibrant-accent transition-colors">
                    {project.title}
                  </h3>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs border border-black bg-transparent text-black px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{project.tech_stack.length - 4} more
                      </span>
                    )}
                  </div>
                  
                  {/* View Arrow */}
                  <div className="flex items-center text-sm text-black font-medium pt-2 group-hover:text-vibrant-accent transition-colors">
                    View Project
                    <svg 
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
