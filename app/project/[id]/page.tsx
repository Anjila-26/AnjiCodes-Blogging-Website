'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase, Project } from '@/lib/supabase';
import FormattedDescription from '@/app/components/FormattedDescription';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
      
      // Keep loading screen for minimum 1 second
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching project:', error);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const delay =
              (entry.target as HTMLElement).dataset.delay || String(100 + index * 100);
            entry.target.classList.add('fade-in-up');
            (entry.target as HTMLElement).style.animationDelay = `${delay}ms`;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animated-section').forEach((section, index) => {
      (section as HTMLElement).dataset.delay = String(100 + index * 100);
      observer.observe(section);
    });

    const backToTopButton = document.getElementById('back-to-top');
    const handleScroll = () => {
      if (window.scrollY > 300 && backToTopButton) {
        backToTopButton.classList.remove('opacity-0', 'pointer-events-none');
      } else if (backToTopButton) {
        backToTopButton.classList.add('opacity-0', 'pointer-events-none');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [project]);

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

  if (!project) {
    return (
      <main className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The project you're looking for doesn't exist.
        </p>
        <Link
          href="/projects"
          className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-sky-500 hover:to-blue-600 transition-all"
        >
          Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-24 flex-grow opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-7xl">
        <section className="py-20">
          <div className="max-w-4xl mx-auto">
            {/* Project Image */}
            {project.image_url && project.image_url.trim() !== '' && (
              <div className="mb-12">
                <div className="w-full">
                  <img
                    alt={project.title}
                    className="w-full max-w-lg h-auto object-cover rounded-xl shadow-lg border-4 border-black transition-transform duration-500 hover:scale-105"
                    src={project.image_url}
                    onError={(e) => {
                      console.error('Image failed to load:', project.image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="space-y-6">
              {project.day_number && (
                <p className="text-lg font-normal text-black">Day {project.day_number}</p>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black mb-4">
                {project.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/anji-code.jpeg"
                  alt="Anji"
                  width={48}
                  height={48}
                  priority
                  className="rounded-full border-2 border-black object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-black">Anjila Subedi</p>
                  {project.project_date && (
                    <p className="text-xs text-gray-600">
                      {new Date(project.project_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>

              <FormattedDescription 
                text={project.description}
                className="text-lg md:text-xl text-subtext-light dark:text-subtext-dark leading-relaxed"
              />
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 pt-4">
                {project.tech_stack.map((tech, i) => (
                  <span
                    key={i}
                    className="border border-black bg-transparent px-4 py-1.5 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                {project.live_link && (
                  <a
                    href={project.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">open_in_new</span>
                    View Live
                  </a>
                )}
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-black bg-transparent text-black px-8 py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">code</span>
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Navigation */}
      <section className="py-10 text-center border-t border-gray-200 dark:border-gray-800">
        <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-7xl">
          <div className="flex justify-center gap-8">
            <Link
              href="/projects"
              className="group flex items-center gap-2 text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                arrow_back
              </span>
              All Projects
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-subtext-light dark:text-subtext-dark hover:text-primary transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
