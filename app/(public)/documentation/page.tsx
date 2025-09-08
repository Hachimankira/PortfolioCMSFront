import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/documentation/Tabs';
import { CopyButton } from '@/app/components/documentation/CopyButton';

export default function DocumentationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
          API Documentation
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Learn how to integrate your portfolio data into your own applications
        </p>
      </div>

      <div className="prose prose-blue max-w-none">
        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
        <p className="mb-6">
          Our API allows you to access portfolio data programmatically. You can use this to display your portfolio on custom websites, applications, or integrate with other services.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium mb-2">Authentication</h3>
          <p className="mb-4">
            All API requests require an API key which should be included in the <code>X-API-Key</code> header.
          </p>
          <div className="bg-gray-100 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">X-API-Key: your_api_key_here</span>
              <CopyButton textToCopy="X-API-Key: {api-key}=" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Base URL</h2>
        <p className="mb-4">
          All API endpoints are relative to the following base URL:
        </p>
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">https://portfoliocms-3pl6.onrender.com/public/&#123;email&#125;/&#123;resource&#125;</span>
            <CopyButton textToCopy="https://portfoliocms-3pl6.onrender.com/public/{email}/{resource}" />
          </div>
        </div>
        <p className="mb-6">
          Replace <code>{'{email}'}</code> with your email address and <code>{'{resource}'}</code> with the specific resource you want to access.
        </p>

        <h2 className="text-2xl font-bold mb-4">Available Endpoints</h2>
        <p className="mb-6">
          The following endpoints are available for fetching portfolio data:
        </p>

        <Tabs defaultValue="projects" className="mb-10">
          <TabsList className="mb-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="sociallinks">Social Links</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Projects</h3>
                <p className="text-sm text-gray-500">Fetch all projects from a portfolio</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="font-mono text-sm font-bold mb-2">GET /public/{'{email}'}/projects</h4>
                <p className="mb-4">Returns an array of project objects for the specified email.</p>

                <h5 className="font-bold text-sm mb-2">Example Request:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <pre>{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/projects' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: {api-key}='`}</pre>
                    <CopyButton 
                      textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/projects' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: {api-key}='`}
                      className="text-white bg-gray-700 hover:bg-gray-600" 
                    />
                  </div>
                </div>

                <h5 className="font-bold text-sm mb-2">Example Response:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre>{`[
  {
    "id": "1",
    "title": "E-commerce Website",
    "description": "A full-stack e-commerce platform built with React and Node.js",
    "imageUrl": "https://example.com/project1.jpg",
    "projectUrl": "https://github.com/username/project",
    "startDate": "2023-01-15",
    "endDate": "2023-03-20",
    "technologies": ["React", "Node.js", "MongoDB"]
  },
  {
    "id": "2",
    "title": "Task Management App",
    "description": "A productivity app for managing daily tasks and projects",
    "imageUrl": "https://example.com/project2.jpg",
    "projectUrl": "https://github.com/username/task-app",
    "startDate": "2022-11-01",
    "endDate": "2023-01-10",
    "technologies": ["Vue.js", "Firebase", "Tailwind CSS"]
  }
]`}</pre>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Skills</h3>
                <p className="text-sm text-gray-500">Fetch all skills from a portfolio</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="font-mono text-sm font-bold mb-2">GET /public/{'{email}'}/skills</h4>
                <p className="mb-4">Returns an array of skill objects for the specified email.</p>

                <h5 className="font-bold text-sm mb-2">Example Request:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <pre>{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/skills' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: {api-key}='`}</pre>
                    <CopyButton 
                      textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/skills' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: {api-key}='`}
                      className="text-white bg-gray-700 hover:bg-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-gray-500">Fetch profile information</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="font-mono text-sm font-bold mb-2">GET /public/{'{email}'}/profile</h4>
                <p className="mb-4">Returns the profile data for the specified email.</p>

                <h5 className="font-bold text-sm mb-2">Example Request:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <pre>{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/profile' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: {api-key}='`}</pre>
                    <CopyButton 
                      textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/profile' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: {api-key}='`}
                      className="text-white bg-gray-700 hover:bg-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experiences">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Experiences</h3>
                <p className="text-sm text-gray-500">Fetch work experiences</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="font-mono text-sm font-bold mb-2">GET /public/{'{email}'}/experiences</h4>
                <p className="mb-4">Returns an array of work experience objects for the specified email.</p>

                <h5 className="font-bold text-sm mb-2">Example Request:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <pre>{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/experiences' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: {api-key}='`}</pre>
                    <CopyButton 
                      textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/experiences' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: {api-key}='`}
                      className="text-white bg-gray-700 hover:bg-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Education</h3>
                <p className="text-sm text-gray-500">Fetch education history</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="font-mono text-sm font-bold mb-2">GET /public/{'{email}'}/education</h4>
                <p className="mb-4">Returns an array of education objects for the specified email.</p>

                <h5 className="font-bold text-sm mb-2">Example Request:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <pre>{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/education' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: {api-key}='`}</pre>
                    <CopyButton 
                      textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/education' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: {api-key}='`}
                      className="text-white bg-gray-700 hover:bg-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Certifications</h3>
                <p className="text-sm text-gray-500">Fetch professional certifications</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="font-mono text-sm font-bold mb-2">GET /public/{'{email}'}/certifications</h4>
                <p className="mb-4">Returns an array of certification objects for the specified email.</p>

                <h5 className="font-bold text-sm mb-2">Example Request:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <pre>{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/certifications' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: {api-key}='`}</pre>
                    <CopyButton 
                      textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/certifications' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: {api-key}='`}
                      className="text-white bg-gray-700 hover:bg-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Testimonials</h3>
                <p className="text-sm text-gray-500">Fetch testimonials and recommendations</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="font-mono text-sm font-bold mb-2">GET /public/{'{email}'}/testimonials</h4>
                <p className="mb-4">Returns an array of testimonial objects for the specified email.</p>

                <h5 className="font-bold text-sm mb-2">Example Request:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <pre>{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/testimonials' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: {api-key}='`}</pre>
                    <CopyButton 
                      textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/testimonials' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: {api-key}='`}
                      className="text-white bg-gray-700 hover:bg-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sociallinks">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Social Links</h3>
                <p className="text-sm text-gray-500">Fetch social media profiles</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="font-mono text-sm font-bold mb-2">GET /public/{'{email}'}/sociallinks</h4>
                <p className="mb-4">Returns an array of social media link objects for the specified email.</p>

                <h5 className="font-bold text-sm mb-2">Example Request:</h5>
                <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-start justify-between">
                    <pre>{`curl -X 'GET' \\
  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/sociallinks' \\
  -H 'accept: */*' \\
  -H 'X-API-Key: {api-key}='`}</pre>
                    <CopyButton 
                      textToCopy={`curl -X 'GET' \\\n  'https://portfoliocms-3pl6.onrender.com/public/t%40t.com/sociallinks' \\\n  -H 'accept: */*' \\\n  -H 'X-API-Key: {api-key}='`}
                      className="text-white bg-gray-700 hover:bg-gray-600" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <h2 className="text-2xl font-bold mb-4">Code Examples</h2>
        
        <Tabs defaultValue="javascript" className="mb-10">
          <TabsList className="mb-4">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>

          <TabsContent value="javascript">
            <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
              <div className="flex items-start justify-between">
                <pre>{`// Fetch projects using fetch API
const fetchProjects = async (email) => {
  try {
    const response = await fetch(
      \`https://portfoliocms-3pl6.onrender.com/public/\${email}/projects\`,
      {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'X-API-Key': '{api-key}='
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Projects:', data);
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Call the function
fetchProjects('t@t.com');`}</pre>
                <CopyButton 
                  textToCopy={`// Fetch projects using fetch API
const fetchProjects = async (email) => {
  try {
    const response = await fetch(
      \`https://portfoliocms-3pl6.onrender.com/public/\${email}/projects\`,
      {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'X-API-Key': '{api-key}='
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Projects:', data);
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// Call the function
fetchProjects('t@t.com');`}
                  className="text-white bg-gray-700 hover:bg-gray-600" 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="react">
            <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
              <div className="flex items-start justify-between">
                <pre>{`import { useState, useEffect } from 'react';

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://portfoliocms-3pl6.onrender.com/public/t@t.com/projects',
          {
            method: 'GET',
            headers: {
              'accept': '*/*',
              'X-API-Key': '{api-key}='
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>My Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.imageUrl && (
              <img src={project.imageUrl} alt={project.title} />
            )}
            <div className="technologies">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            {project.projectUrl && (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`}</pre>
                <CopyButton 
                  textToCopy={`import { useState, useEffect } from 'react';

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://portfoliocms-3pl6.onrender.com/public/t@t.com/projects',
          {
            method: 'GET',
            headers: {
              'accept': '*/*',
              'X-API-Key': '{api-key}='
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>My Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.imageUrl && (
              <img src={project.imageUrl} alt={project.title} />
            )}
            <div className="technologies">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            {project.projectUrl && (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`}
                  className="text-white bg-gray-700 hover:bg-gray-600" 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="python">
            <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm overflow-x-auto mb-4">
              <div className="flex items-start justify-between">
                <pre>{`import requests

def fetch_portfolio_data(email, resource_type):
    """
    Fetch portfolio data from the API
    
    Args:
        email (str): The email address of the portfolio owner
        resource_type (str): The type of resource to fetch (projects, skills, etc.)
        
    Returns:
        dict or list: The portfolio data
    """
    url = f"https://portfoliocms-3pl6.onrender.com/public/{email}/{resource_type}"
    
    headers = {
        "accept": "*/*",
        "X-API-Key": "{api-key}="
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {resource_type}: {e}")
        return []

# Example usage
email = "t@t.com"
projects = fetch_portfolio_data(email, "projects")
skills = fetch_portfolio_data(email, "skills")
profile = fetch_portfolio_data(email, "profile")

print(f"Found {len(projects)} projects")
for project in projects:
    print(f"Project: {project.get('title')}")`}</pre>
                <CopyButton 
                  textToCopy={`import requests

def fetch_portfolio_data(email, resource_type):
    """
    Fetch portfolio data from the API
    
    Args:
        email (str): The email address of the portfolio owner
        resource_type (str): The type of resource to fetch (projects, skills, etc.)
        
    Returns:
        dict or list: The portfolio data
    """
    url = f"https://portfoliocms-3pl6.onrender.com/public/{email}/{resource_type}"
    
    headers = {
        "accept": "*/*",
        "X-API-Key": "{api-key}="
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {resource_type}: {e}")
        return []

# Example usage
email = "t@t.com"
projects = fetch_portfolio_data(email, "projects")
skills = fetch_portfolio_data(email, "skills")
profile = fetch_portfolio_data(email, "profile")

print(f"Found {len(projects)} projects")
for project in projects:
    print(f"Project: {project.get('title')}")`}
                  className="text-white bg-gray-700 hover:bg-gray-600" 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
        <p className="mb-4">
          The API uses standard HTTP status codes to indicate success or failure of requests:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li className="mb-2"><strong>200 OK</strong> - Request succeeded</li>
          <li className="mb-2"><strong>400 Bad Request</strong> - Invalid request parameters</li>
          <li className="mb-2"><strong>401 Unauthorized</strong> - Missing or invalid API key</li>
          <li className="mb-2"><strong>404 Not Found</strong> - Resource not found</li>
          <li className="mb-2"><strong>500 Internal Server Error</strong> - Server error</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Rate Limiting</h2>
        <p className="mb-6">
          To ensure fair usage, the API implements rate limiting. If you exceed the rate limit, you'll receive a 429 Too Many Requests response. Please wait before retrying your request.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Never share your API key publicly. The key shown in these examples is for demonstration purposes only.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Getting Help</h2>
        <p>
          If you need additional help or have questions about the API, please contact our support team or visit the community forum.
        </p>
      </div>
    </div>
  );
}