'use client';

import { useState, useEffect } from 'react';
import { Hackathon, Project } from '@/types';

interface CareerOpportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  requirements: string[];
  benefits: string[];
  applicationStatus: string;
}

interface UniversityEvent {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  speakers: string[];
  capacity: number;
  registered: number;
  description: string;
  tags?: string[];
  virtual?: boolean;
  price?: string;
}

interface UniversityData {
  hackathons: Hackathon[];
  projects: Project[];
  opportunities: CareerOpportunity[];
  events: UniversityEvent[];
}

export function useUniversityData() {
  const [data, setData] = useState<UniversityData>({
    hackathons: [],
    projects: [],
    opportunities: [],
    events: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from backend API
        const [hackathonsRes, projectsRes, opportunitiesRes, eventsRes] = await Promise.all([
          fetch('/api/university/hackathons'),
          fetch('/api/university/projects'),
          fetch('/api/university/opportunities'),
          fetch('/api/university/events')
        ]);

        const [hackathonsData, projectsData, opportunitiesData, eventsData] = await Promise.all([
          hackathonsRes.json(),
          projectsRes.json(),
          opportunitiesRes.json(),
          eventsRes.json()
        ]);

        const universityData: UniversityData = {
          hackathons: hackathonsData.success ? hackathonsData.data : [],
          projects: projectsData.success ? projectsData.data : [],
          opportunities: opportunitiesData.success ? opportunitiesData.data : [],
          events: eventsData.success ? eventsData.data : []
        };

        setData(universityData);
        setError(null);
      } catch (err) {
        setError('Failed to load university data');
        console.error('Error fetching university data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, []);

  return { data, loading, error };
}