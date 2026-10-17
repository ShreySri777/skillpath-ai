
import { useState } from 'react'
import './App.css'
import { analyzeCareer as fetchCareerAnalysis } from './services/careerApi'

const initialSkills = ['Python', 'SQL']

const skillOptions = [
  'Python',
  'SQL',
  'JavaScript',
  'React',
  'Java',
  'Machine Learning',
  'Data Structures',
  'Git',
]

const careerData = {
  'AI Engineer': {
    description: 'Build intelligent systems and AI-powered applications.',
    demand: 'High demand',
    missing: ['Machine Learning', 'Deep Learning', 'PyTorch'],
    roadmap: [
      {
        title: 'Machine Learning',
        level: 'Beginner',
        time: '2 weeks',
        reason: 'Learn the foundations of predictive models.',
      },
      {
        title: 'Deep Learning',
        level: 'Intermediate',
        time: '3 weeks',
        reason: 'Understand neural networks and model training.',
      },
      {
        title: 'PyTorch',
        level: 'Intermediate',
        time: '2 weeks',
        reason: 'Build and experiment with deep learning models.',
      },
    ],
  },
  'Full Stack Developer': {
    description: 'Create complete web applications from frontend to backend.',
    demand: 'Strong demand',
    missing: ['JavaScript', 'React', 'Node.js'],
    roadmap: [
      {
        title: 'JavaScript',
        level: 'Beginner',
        time: '2 weeks',
        reason: 'Master the language used for interactive web apps.',
      },
      {
        title: 'React',
        level: 'Intermediate',
        time: '3 weeks',
        reason: 'Build reusable components and modern interfaces.',
      },
      {
        title: 'Node.js',
        level: 'Intermediate',
        time: '2 weeks',
        reason: 'Create backend APIs and server-side applications.',
      },
    ],
  },
  'Data Scientist': {
    description: 'Turn data into insights using statistics and machine learning.',
    demand: 'High demand',
    missing: ['Statistics', 'Pandas', 'Machine Learning'],
    roadmap: [
      {
        title: 'Statistics',
        level: 'Beginner',
        time: '2 weeks',
        reason: 'Understand distributions, probability and inference.',
      },
      {
        title: 'Pandas',
        level: 'Beginner',
        time: '1 week',
        reason: 'Clean, transform and analyze datasets.',
      },
      {
        title: 'Machine Learning',
        level: 'Intermediate',
        time: '3 weeks',
        reason: 'Build models that discover patterns in data.',
      },
    ],
  },
}

function App() {
  const [targetRole, setTargetRole] = useState('AI Engineer')
  const [skills, setSkills] = useState(initialSkills)
  const [newSkill, setNewSkill] = useState('')
  const [analyzed, setAnalyzed] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')

  const career = careerData[targetRole]

  const missingSkills = analysisResult
    ? analysisResult.missing_skills
    : career.missing.filter(
        (skill) =>
          !skills.some(
            (existing) => existing.toLowerCase() === skill.toLowerCase(),
          ),
      )

  const roadmapItems = analysisResult
    ? analysisResult.roadmap.map((title, index) => ({
        title,
        level: index === 0 ? 'Beginner' : 'Intermediate',
        time: '2 weeks',
        reason: `Build this skill to progress toward ${targetRole}.`,
      }))
    : career.roadmap.filter((item) => missingSkills.includes(item.title))

  const progress = Math.round(
    (career.missing.length /
      Math.max(career.missing.length + missingSkills.length, 1)) *
      100,
  )

  function addSkill() {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill])
      setNewSkill('')
      setAnalyzed(false)
      setAnalysisResult(null)
    }
  }

  function removeSkill(skill) {
    setSkills(skills.filter((item) => item !== skill))
    setAnalyzed(false)
    setAnalysisResult(null)
  }

  async function analyzeCareer(event) {
    event.preventDefault()
    setIsAnalyzing(true)
    setAnalysisError('')

    try {
      const result = await fetchCareerAnalysis(targetRole, skills)
      setAnalysisResult(result)
      setAnalyzed(true)
    } catch (error) {
      setAnalysisError(
        error.message || 'Something went wrong. Please try again.',
      )
      setAnalysisResult(null)
      setAnalyzed(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" aria-label="SkillPath AI home">
          <span className="brand-mark">S</span>
          <span>
            SkillPath<span className="brand-ai"> AI</span>
          </span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="side-nav">
          <a className="nav-item active" href="#dashboard">
            <span>▦</span> Dashboard
          </a>
          <a className="nav-item" href="#roadmap">
            <span>⌁</span> My roadmap
          </a>
          <a className="nav-item" href="#skills">
            <span>◇</span> My skills
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="graph-card">
            <div className="graph-icon">✳</div>
            <strong>Powered by knowledge graphs</strong>
            <p>Discover how skills connect to your dream career.</p>
            <span className="graph-status">
              <i /> Graph insights preview
            </span>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>Student workspace</strong>
              <small>Career explorer</small>
            </div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Dashboard</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-badge">
              <i /> Interactive demo
            </span>
            <button
              className="help-button"
              type="button"
              title="About SkillPath AI"
            >
              ?
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span>✳</span> YOUR CAREER, MAPPED
              </div>
              <h1>
                Turn your skills into <span>your future.</span>
              </h1>
              <p className="welcome-copy">
                Discover your skill gaps and get a clear, personalized path to
                your dream role.
              </p>
            </div>

            <div className="welcome-art" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="art-node node-one">Py</div>
              <div className="art-node node-two">AI</div>
              <div className="art-node node-three">↗</div>
              <div className="art-core">✳</div>
              <div className="art-line line-one" />
              <div className="art-line line-two" />
            </div>
          </section>

          <section className="workspace-grid">
            <form className="panel career-panel" onSubmit={analyzeCareer}>
              <div className="panel-heading">
                <div>
                  <span className="step-label">STEP 01</span>
                  <h2>Define your destination</h2>
                  <p>Start with the role you want to grow into.</p>
                </div>
                <span className="heading-icon">◎</span>
              </div>

              <label className="field-label" htmlFor="target-role">
                Target career
              </label>

              <select
                id="target-role"
                value={targetRole}
                onChange={(event) => {
                  setTargetRole(event.target.value)
                  setAnalyzed(false)
                  setAnalysisResult(null)
                }}
              >
                {Object.keys(careerData).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <p className="role-description">{career.description}</p>

              <div className="field-label skills-label" id="skills">
                Your current skills
              </div>
              <p className="field-hint">
                Add the skills you already know. We'll map what comes next.
              </p>

              <div className="skill-chips">
                {skills.map((skill) => (
                  <span className="skill-chip" key={skill}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <span className="empty-skills">No skills added yet.</span>
                )}
              </div>

              <div className="add-skill-row">
                <select
                  aria-label="Choose a skill to add"
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                >
                  <option value="">Choose a skill...</option>
                  {skillOptions
                    .filter((skill) => !skills.includes(skill))
                    .map((skill) => (
                      <option value={skill} key={skill}>
                        {skill}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  className="add-button"
                  onClick={addSkill}
                  disabled={!newSkill}
                >
                  + Add
                </button>
              </div>

              <button
                type="submit"
                className="analyze-button"
                disabled={isAnalyzing}
              >
                <span>✳</span>
                {isAnalyzing ? 'Analyzing...' : 'Analyze my career path'}
                {!isAnalyzing && <span className="button-arrow">→</span>}
              </button>

              <p className="privacy-note">
                <span>⌑</span> Your skills stay in this interactive demo.
              </p>

              {analysisError && (
                <p role="alert" className="analysis-error">
                  {analysisError}
                </p>
              )}
            </form>

            <section className="panel insights-panel">
              <div className="panel-heading">
                <div>
                  <span className="step-label">YOUR OVERVIEW</span>
                  <h2>Career snapshot</h2>
                  <p>A first look at your journey ahead.</p>
                </div>
                <span className="snapshot-icon">↗</span>
              </div>

              <div className="snapshot-role">
                <div className="role-symbol">✳</div>
                <div>
                  <small>YOUR TARGET ROLE</small>
                  <strong>{targetRole}</strong>
                </div>
                <span className="demand-pill">{career.demand}</span>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-icon purple">◇</span>
                  <strong>{skills.length}</strong>
                  <span>Skills added</span>
                </div>

                <div className="metric-card">
                  <span className="metric-icon orange">⌁</span>
                  <strong>{missingSkills.length}</strong>
                  <span>Skills to explore</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-heading">
                  <span>Career readiness</span>
                  <strong>{progress}%</strong>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p>
                  {analyzed
                    ? 'Your demo analysis is ready below.'
                    : 'Add your skills and analyze to explore your next steps.'}
                </p>
              </div>

              <div className="graph-note">
                <span className="graph-note-icon">✳</span>
                <div>
                  <strong>More than a checklist</strong>
                  <p>
                    SkillPath is designed to connect skills, prerequisites and
                    career requirements in a knowledge graph.
                  </p>
                </div>
              </div>
            </section>
          </section>

          <section className="roadmap-section" id="roadmap">
            <div className="section-title-row">
              <div>
                <span className="step-label">STEP 02</span>
                <h2>Your suggested learning path</h2>
                <p>Explore a possible route toward {targetRole}.</p>
              </div>
              <span className="roadmap-count">
                {missingSkills.length} skills to explore
              </span>
            </div>

            {missingSkills.length === 0 ? (
              <div className="empty-roadmap">
                <span>✓</span>
                <div>
                  <strong>Looking good!</strong>
                  <p>
                    Your current skills cover the sample requirements for this
                    role.
                  </p>
                </div>
              </div>
            ) : (
              <div className="roadmap-list">
                {roadmapItems.map((item, index) => (
                  <article className="roadmap-card" key={item.title}>
                    <div className="roadmap-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="roadmap-main">
                      <div className="roadmap-card-top">
                        <h3>{item.title}</h3>
                        <span
                          className={`level level-${item.level.toLowerCase()}`}
                        >
                          {item.level}
                        </span>
                      </div>
                      <p>{item.reason}</p>
                      <div className="roadmap-meta">
                        <span>◷ {item.time}</span>
                        <span>◇ Recommended skill</span>
                      </div>
                    </div>
                    <div className="roadmap-arrow">↗</div>
                  </article>
                ))}
              </div>
            )}

            {analysisResult?.recommendations?.length > 0 && (
              <section className="recommendations-section">
                <div className="section-title-row">
                  <div>
                    <span className="step-label">STEP 03</span>
                    <h2>Recommended courses &amp; projects</h2>
                    <p>
                      Explore resources that help close your skill gaps.
                    </p>
                  </div>
                </div>

                <div className="roadmap-list">
                  {analysisResult.recommendations.map(
                    (recommendation, index) => (
                      <article
                        className="roadmap-card"
                        key={`${recommendation.type}-${recommendation.title}`}
                      >
                        <div className="roadmap-number">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className="roadmap-main">
                          <div className="roadmap-card-top">
                            <h3>{recommendation.title}</h3>
                            <span className="level level-beginner">
                              {recommendation.type}
                            </span>
                          </div>
                          <p>{recommendation.reason}</p>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              </section>
            )}

            <div className="prototype-disclaimer">
              <span>ⓘ</span> Demo preview: recommendations use sample data. Real
              graph-powered analysis will be connected to the backend.
            </div>
          </section>

          <footer className="footer">
            <span>
              SkillPath AI <span className="footer-dot">·</span> Find your next
              step.
            </span>
            <span>
              Built for the future of learning{' '}
              <span className="footer-star">✳</span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
