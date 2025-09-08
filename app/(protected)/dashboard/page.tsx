'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoutes';
import { RefreshCw, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CopyButton } from '@/app/components/documentation/CopyButton';
import apiKeyService from '@/lib/services/apikey.service';


export default function DashboardPage() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
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
                      {apiKey || 'No API key found'}
                    </div>
                    {apiKey && <CopyButton textToCopy={apiKey} />}
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
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
              <p className="mt-2 text-sm text-gray-500">Update your personal information and headline</p>
            </button>
            
            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Add New Project</h3>
              <p className="mt-2 text-sm text-gray-500">Showcase your latest work in your portfolio</p>
            </button>
            
            <button className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">Update Skills</h3>
              <p className="mt-2 text-sm text-gray-500">Add or modify your technical and professional skills</p>
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}