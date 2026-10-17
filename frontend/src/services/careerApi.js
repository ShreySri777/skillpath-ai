
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const mockCareerData = {
  'AI Engineer': {
    missing_skills: ['Machine Learning', 'Model Evaluation'],
    roadmap: ['Machine Learning', 'Model Evaluation'],
    recommendations: [
      {
        title: 'Machine Learning Fundamentals',
        type: 'course',
        reason: 'Covers the Machine Learning skill required for your target role.',
      },
      {
        title: 'Build a Model Evaluation Dashboard',
        type: 'project',
        reason: 'Practise evaluating model performance and comparing metrics.',
      },
    ],
  },
  'Full Stack Developer': {
    missing_skills: ['JavaScript', 'React', 'Node.js'],
    roadmap: ['JavaScript', 'React', 'Node.js'],
    recommendations: [
      {
        title: 'Modern JavaScript Fundamentals',
        type: 'course',
        reason: 'Builds the JavaScript foundation needed for frontend development.',
      },
      {
        title: 'Build a Full Stack Web App',
        type: 'project',
        reason: 'Practise connecting a React frontend to a Node.js backend.',
      },
    ],
  },
  'Data Scientist': {
    missing_skills: ['Statistics', 'Pandas', 'Machine Learning'],
    roadmap: ['Statistics', 'Pandas', 'Machine Learning'],
    recommendations: [
      {
        title: 'Statistics for Data Science',
        type: 'course',
        reason: 'Develops the statistical foundation needed to analyze data.',
      },
      {
        title: 'Explore a Dataset with Python',
        type: 'project',
        reason: 'Practise cleaning, analyzing and explaining real dataset patterns.',
      },
    ],
  },
}

export async function analyzeCareer(targetRole, skills, useMockData = true) {
  const requestBody = {
    target_role: targetRole,
    skills,
  }

  if (useMockData) {
    const career = mockCareerData[targetRole] || mockCareerData['AI Engineer']

    return {
      target_role: targetRole,
      existing_skills: skills,
      ...career,
      recommendations: career.recommendations,
    }
  }

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    throw new Error(`Career analysis failed (${response.status}). Please try again.`)
  }

  return response.json()
}
