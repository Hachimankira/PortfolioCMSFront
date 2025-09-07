'use client';

import { useState } from 'react';
import { Skill } from '@/lib/types/skills.types';
import { Edit, Trash2, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';

interface SkillListProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export default function SkillList({ 
  skills, 
  onEdit, 
  onDelete, 
  loading = false 
}: SkillListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        setDeletingId(id);
        await onDelete(id);
        toast.success('Skill deleted successfully');
      } catch (error) {
        toast.error('Failed to delete skill');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getSkillLevelColor = (level?: string) => {
    if (!level) return 'bg-gray-200';
    
    const levelNum = parseInt(level);
    if (levelNum <= 3) return 'bg-red-500';
    if (levelNum <= 6) return 'bg-yellow-500';
    if (levelNum <= 8) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getSkillLevelText = (level?: string) => {
    if (!level) return 'Not specified';
    
    const levelNum = parseInt(level);
    if (levelNum <= 2) return 'Beginner';
    if (levelNum <= 4) return 'Basic';
    if (levelNum <= 6) return 'Intermediate';
    if (levelNum <= 8) return 'Advanced';
    return 'Expert';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <BarChart className="h-24 w-24" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
        <p className="text-gray-500">Get started by adding your skills and expertise</p>
      </div>
    );
  }

  // Group skills by category
  const groupedSkills: Record<string, Skill[]> = {};
  skills.forEach(skill => {
    const category = skill.category || 'Uncategorized';
    if (!groupedSkills[category]) {
      groupedSkills[category] = [];
    }
    groupedSkills[category].push(skill);
  });

  return (
    <div className="space-y-8">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
          
          <div className="space-y-4">
            {categorySkills.map((skill) => (
              <div key={skill.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-base font-medium text-gray-800">{skill.name}</h4>
                    {skill.level && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 mr-2">
                          {getSkillLevelText(skill.level)}
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {skill.level}/10
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(skill)}
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      title="Edit skill"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
                      disabled={deletingId === skill.id}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50"
                      title="Delete skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {skill.level && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getSkillLevelColor(skill.level)}`} 
                      style={{ width: `${parseInt(skill.level) * 10}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}