'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoutes';
import { RefreshCw, Shield, AlertCircle, Loader2, Eye, EyeOff, User, Plus, Award, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CopyButton } from '@/app/components/documentation/CopyButton';
import apiKeyService from '@/lib/services/apikey.service';
import Link from 'next/link';


export default function DashboardPage() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Fetch current API key on page load
  useEffect(() => {
    async function fetchApiKey() {
      try {
        setIsLoading(true);
        const data = await apiKeyService.getCurrentKey();
        setApiKey(data.key || data.apiKey || '');
      } catch (err) {
        setError('Failed to load API key');
        toast.error('Could not load your API key');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchApiKey();
  }, [token]);
  
  const handleRegenerateKey = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    
    try {
      setIsRegenerating(true);
      const data = await apiKeyService.regenerateKey();
      
      if (data && (data.key || data.apiKey)) {
        setApiKey(data.key || data.apiKey);
        toast.success('API key regenerated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      toast.error('Failed to regenerate API key');
      console.error(error);
    } finally {
      setIsRegenerating(false);
      setShowConfirmation(false);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  };

  return (
    <ProtectedRoute>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* API Key Management Card */}
          <div className="col-span-1 sm:col-span-2 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">API Key</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              
              <p className="mt-1 text-sm text-gray-500">
                Use this API key to access your portfolio data from external applications.
              </p>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">Loading API key...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-2">
                    <span className="text-sm text-red-500">{error}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm truncate max-w-sm">
                      {apiKey ? (showApiKey ? apiKey : maskApiKey(apiKey)) : 'No API key found'}
                    </div>
                    <div className="flex items-center space-x-2">
                      {apiKey && (
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                          title={showApiKey ? 'Hide API key' : 'Show API key'}
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      {apiKey && <CopyButton textToCopy={apiKey} />}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                {showConfirmation ? (
                  <div className="bg-yellow-50 p-4 rounded-md mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Regenerating your API key will invalidate your current key. 
                            Any applications using this key will need to be updated.
                          </p>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <button
                            type="button"
                            onClick={handleRegenerateKey}
                            disabled={isRegenerating}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            {isRegenerating ? (
                              <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Regenerating...
                              </>
                            ) : (
                              'Yes, regenerate key'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowConfirmation(false)}
                            disabled={isRegenerating}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleRegenerateKey}
                    disabled={isLoading || isRegenerating}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRegenerating ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {apiKey ? 'Regenerate API Key' : 'Generate API Key'}
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  Keep your API key secure. Don't share it in public repositories or client-side code.
                </div>
              </div>
              
              {apiKey && (
                <div className="mt-4 text-sm text-gray-500">
                  <p>Example API call:</p>
                  <div className="mt-2 bg-gray-800 text-gray-200 p-3 rounded-md overflow-x-auto font-mono text-xs">
                    <div className="flex items-start justify-between">
                      <pre className="whitespace-pre-wrap">{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/${user?.email || 'your-email'}/projects' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: ${apiKey}'`}</pre>
                      <CopyButton 
                        textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/${user?.email || 'your-email'}/projects' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: ${apiKey}'`}
                        className="text-white bg-gray-700 hover:bg-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Portfolio Stats Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Portfolio Stats</h3>
              
              <dl className="mt-5 grid grid-cols-1 gap-5">
                <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-md">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-md">
                  <dt className="text-sm font-medium text-gray-500 truncate">API Calls (30d)</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-md">
                  <dt className="text-sm font-medium text-gray-500 truncate">Profile Completion</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0%</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Quick Links Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Edit Profile Card */}
            <Link href="/profile" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-blue-300 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        Edit Profile
                      </h3>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="mt-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  Update your personal information, headline, and professional summary
                </p>
              </div>
            </Link>
            
            {/* Add New Project Card */}
            <Link href="/projects" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-green-300 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Plus className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                        Add New Project
                      </h3>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="mt-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  Showcase your latest work and add it to your portfolio
                </p>
              </div>
            </Link>
            
            {/* Update Skills Card */}
            <Link href="/skills" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-purple-300 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        Update Skills
                      </h3>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="mt-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  Add or modify your technical and professional skills
                </p>
              </div>
            </Link>
            
            {/* Add Experience Card */}
            <Link href="/experience" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-orange-300 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                        Add Experience
                      </h3>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="mt-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  Document your work experience and career achievements
                </p>
              </div>
            </Link>
            
            {/* Add Education Card */}
            <Link href="/education" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-indigo-300 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        Add Education
                      </h3>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="mt-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  Add your educational background and qualifications
                </p>
              </div>
            </Link>
            
            {/* Add Certificates Card */}
            <Link href="/certificates" className="group">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-yellow-300 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-yellow-600 transition-colors">
                        Add Certificates
                      </h3>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="mt-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  Showcase your certifications and professional achievements
                </p>
              </div>
            </Link>
            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}