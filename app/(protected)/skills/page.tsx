'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';
import { Skill, CreateSkillDto, UpdateSkillDto } from '@/lib/types/skills.types';
import { skillsService } from '@/lib/services/skills.service';
import SkillList from '@/app/components/skills/SkillList';
import SkillForm from '@/app/components/skills/SkillForm';

export default function SkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const data = await skillsService.getAll();
            // Sort by display order
            setSkills(data.sort((a, b) => a.displayOrder - b.displayOrder));
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: CreateSkillDto | UpdateSkillDto) => {
        try {
            setSubmitting(true);
            if (!data.name || !data.level || !data.displayOrder || !data.category) {
                throw new Error('Missing required fields for skill creation');
            }
            const newSkill = await skillsService.create({
                name: data.name,
                level: data.level,
                displayOrder: data.displayOrder,
                category: data.category,
            });
            setSkills(prev => [...prev, newSkill].sort((a, b) => a.displayOrder - b.displayOrder));
            setShowForm(false);
            toast.success('Skill added successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to add skill');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (data: UpdateSkillDto) => {
        if (!editingSkill) return;

        try {
            setSubmitting(true);
            const updatedSkill = await skillsService.update(editingSkill.id, data);
            setSkills(prev =>
                prev.map(skill =>
                    skill.id === editingSkill.id ? updatedSkill : skill
                ).sort((a, b) => a.displayOrder - b.displayOrder)
            );
            setEditingSkill(null);
            setShowForm(false);
            toast.success('Skill updated successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update skill');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await skillsService.delete(id);
            setSkills(prev => prev.filter(skill => skill.id !== id));
            //   return true;
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete skill');
            throw error;
        }
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingSkill(null);
    };

    // Get unique categories for the filter
    const categories = ['all', ...new Set(skills.map(skill => skill.category || 'Uncategorized'))];

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter ||
            (categoryFilter === 'Uncategorized' && !skill.category);

        return matchesSearch && matchesCategory;
    });

    // Calculate stats
    const totalSkills = skills.length;
    const skillsByLevel = skills.reduce((acc, skill) => {
        if (!skill.level) return acc;

        const level = parseInt(skill.level);
        if (level >= 9) acc.expert++;
        else if (level >= 7) acc.advanced++;
        else if (level >= 4) acc.intermediate++;
        else acc.beginner++;

        return acc;
    }, { beginner: 0, intermediate: 0, advanced: 0, expert: 0 });

    if (showForm) {
        return (
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <BarChart className="h-7 w-7 mr-3" />
                        {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                    </h1>
                    <p className="mt-1 text-gray-600">
                        {editingSkill
                            ? 'Update your skill details'
                            : 'Add a new skill to your portfolio'
                        }
                    </p>
                </div>

                <SkillForm
                    skill={editingSkill || undefined}
                    onSubmit={editingSkill ? handleUpdate : handleCreate}
                    onCancel={handleCancelForm}
                    loading={submitting}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <BarChart className="h-7 w-7 mr-3" />
                        Skills & Expertise
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Manage your skills and proficiency levels
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Skill
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            {skills.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="card bg-white p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Skills</h3>
                        <p className="mt-1 text-xl font-semibold">{totalSkills}</p>
                    </div>
                    <div className="card bg-white p-4">
                        <h3 className="text-sm font-medium text-gray-500">Expert (9-10)</h3>
                        <p className="mt-1 text-xl font-semibold">{skillsByLevel.expert}</p>
                    </div>
                    <div className="card bg-white p-4">
                        <h3 className="text-sm font-medium text-gray-500">Advanced (7-8)</h3>
                        <p className="mt-1 text-xl font-semibold">{skillsByLevel.advanced}</p>
                    </div>
                    <div className="card bg-white p-4">
                        <h3 className="text-sm font-medium text-gray-500">Intermediate (4-6)</h3>
                        <p className="mt-1 text-xl font-semibold">{skillsByLevel.intermediate}</p>
                    </div>
                    <div className="card bg-white p-4">
                        <h3 className="text-sm font-medium text-gray-500">Beginner (1-3)</h3>
                        <p className="mt-1 text-xl font-semibold">{skillsByLevel.beginner}</p>
                    </div>
                </div>
            )}

            {skills.length > 0 && (
                <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    <div className="relative w-full sm:w-64">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="all">All Categories</option>
                            {categories
                                .filter(category => category !== 'all')
                                .map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            )}

            <SkillList
                skills={filteredSkills}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
            />
        </div>
    );
}