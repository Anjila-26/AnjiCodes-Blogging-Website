'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase, Project } from '@/lib/supabase';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .limit(4);

      if (error) throw error;
      setFeaturedProjects(data || []);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('in-view'), i * 80);
            o.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((c) => obs.observe(c));

    return () => obs.disconnect();
  }, []);

  return (
    <main className="pt-24 flex-grow">
      <div className="px-4 md:px-10 lg:px-20 mx-auto max-w-7xl">
        {/* Hero */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                30 Projects in 30 Days, My Journey of Building and Learning
              </h1>
              <p className="text-lg md:text-xl text-subtext-light dark:text-subtext-dark max-w-3xl mx-auto md:mx-0 mb-4">
                 I applied to hundreds of companies and faced many rejections or no replies. Programiz
                gave me a chance, but I needed to complete 30 projects in 30 days to be able to get a
                proper job. So this is me trying to re-learn, learn, and grow.
              </p>
              

              <div className="flex justify-center md:justify-start gap-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-transparent text-black px-5 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all duration-300"
                >
                  View All Projects
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="hidden md:block hover:transform hover:-translate-y-2 transition-all duration-500 relative w-[180px] h-[280px] border-4 border-black rounded-xl shadow-lg">
                <Image 
                  src="/cat_run.gif" 
                  alt="Profile" 
                  width={200} 
                  height={280}
                  priority
                  unoptimized
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                  className={`rounded-lg object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoadingComplete={() => setImageLoaded(true)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Fun Challenge Highlights */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-black rounded-xl p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                <svg className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <h3 className="text-4xl font-black mb-2">30</h3>
                <p className="text-lg font-medium text-black">Projects Built</p>
                <p className="text-sm text-gray-600 mt-2">One idea per day</p>
              </div>
              <div className="bg-white border-2 border-black rounded-xl p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                <svg className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <h3 className="text-4xl font-black mb-2">30</h3>
                <p className="text-lg font-medium text-black">Days of Coding</p>
                <p className="text-sm text-gray-600 mt-2">Non-stop learning</p>
              </div>
              <div className="bg-white border-2 border-black rounded-xl p-8 text-center hover:-translate-y-2 transition-all duration-300 hover:shadow-xl group">
                <svg className="w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <h3 className="text-4xl font-black mb-2">∞</h3>
                <p className="text-lg font-medium text-black">Lessons Learned</p>
                <p className="text-sm text-gray-600 mt-2">Growing every day</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-black tracking-tight">Featured Projects</h3>
            <Link href="/projects" className="text-sm text-black font-medium hover:text-vibrant-accent transition-colors flex items-center gap-1">
              See all projects
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border-2 border-black rounded-xl p-5 space-y-3 animate-pulse">
                  <div className="bg-gray-300 h-6 w-16 rounded-full"></div>
                  <div className="bg-gray-300 h-12 rounded"></div>
                  <div className="flex gap-1.5">
                    <div className="bg-gray-300 h-6 w-16 rounded"></div>
                    <div className="bg-gray-300 h-6 w-16 rounded"></div>
                    <div className="bg-gray-300 h-6 w-16 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="py-10 text-gray-600">
              No featured projects yet. Add some in the admin panel!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="card group block bg-white border-2 border-black rounded-xl overflow-hidden transition-all duration-500 hover:transform hover:-translate-y-1 hover:shadow-xl opacity-0"
                  style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards` }}
                >
                  <div className="p-5 space-y-3">
                    {/* Day Badge */}
                    {project.day_number && (
                      <div className="inline-block">
                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                          Day {project.day_number}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h4 className="text-lg font-black tracking-tight text-black leading-tight group-hover:text-vibrant-accent transition-colors min-h-[3rem]">
                      {project.title}
                    </h4>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs border border-black bg-transparent text-black px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {/* View Arrow */}
                    <div className="flex items-center text-xs text-black font-medium pt-1 group-hover:text-vibrant-accent transition-colors">
                      View Project
                      <svg 
                        className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" 
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
        </section>
      </div>
    </main>
  );
}
