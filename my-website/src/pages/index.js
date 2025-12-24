import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContainer}>
        <motion.div 
          className={styles.heroText}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.heroLabel}>Interactive Curriculum</div>
          <h1 className={styles.heroTitle}>
            The Future of <br />
            <span style={{ color: '#00E5FF' }}>Agentic AI & Robotics</span>
          </h1>
          <p className={styles.heroSubtitle}>
            A comprehensive, open-source textbook designed to take you from basic concepts to building self-evolving, embodied intelligence.
            <br />
            <br />
            <span style={{ color: '#fff', fontWeight: 'bold' }}>You will learn to: </span>
            <span style={{ color: '#00E5FF' }}>
              <Typewriter
                words={[
                  'Design Autonomous Agents',
                  'Simulate in Digital Twins',
                  'Deploy VLA Models',
                  'Orchestrate Multi-Agent Swarms'
                ]}
                loop={0}
                cursor
                cursorStyle='|'
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              style={{ backgroundColor: '#00E5FF', borderColor: '#00E5FF', color: '#000', fontWeight: 'bold' }}
              to="/docs/chapter-1-introduction-to-physical-ai">
              Start Reading Now 📖
            </Link>
            <Link
              className="button button--secondary button--lg"
              style={{ backgroundColor: '#00B3FF', borderColor: '#00B3FF', color: '#fff', fontWeight: 'bold' }}
              to="/chat">
              Chat with AI Assistant 💬
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="https://github.com/Ayeshaaaqil/Physical-AI-Humanoid-Robotics-Textbook">
              View Source Code
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.heroImage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
            <img 
              src="img/hero_robot.jpg" 
              alt="Futuristic AI Robot" 
              style={{ borderRadius: '15px' }}
            />
        </motion.div>
      </div>
    </header>
  );
}

const CurriculumModules = [
  {
    title: 'Foundations of Agentic AI',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
    description: 'Understand the core architecture of autonomous agents, from perception to action loops and memory systems.',
    link: '/docs/chapter-1-introduction-to-physical-ai'
  },
  {
    title: 'Humanoid Control',
    image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&q=80&w=400',
    description: 'Deep dive into bipedal locomotion, balance control, and dexterity for humanoid form factors.',
    link: '/docs/chapter-2-basics-of-humanoid-robotics'
  },
  {
    title: 'ROS 2 Fundamentals',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    description: 'Master the Robot Operating System (ROS 2), the industry standard for building modular robot software.',
    link: '/docs/chapter-3-ros-2-fundamentals'
  },
  {
    title: 'Digital Twin Simulation',
    image: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?auto=format&fit=crop&q=80&w=400',
    description: 'Master physics-based simulation environments to train robots safely before real-world deployment.',
    link: '/docs/chapter-4-digital-twin-simulation'
  },
  {
    title: 'Vision-Language-Action',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400',
    description: 'Implement VLA models that allow robots to understand natural language and execute complex physical tasks.',
    link: '/docs/chapter-5-vision-language-action-systems'
  },
  {
    title: 'Capstone AI Pipeline',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=400',
    description: 'Integrate everything to build a complete end-to-end pipeline for an intelligent, autonomous robot.',
    link: '/docs/chapter-6-capstone-ai-robot-pipeline'
  }
];

function CurriculumSection() {
  return (
    <section className={styles.curriculumSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Curriculum Modules</h2>
        <p className={styles.sectionSubtitle}>
          A structured learning path designed for engineers and researchers.
        </p>
      </div>
      
      <div className={styles.modulesGrid}>
        {CurriculumModules.map((module, idx) => (
          <div key={idx} className={styles.moduleCard}>
            <div className={styles.moduleNumber}>0{idx + 1}</div>
            <div className={styles.moduleContent}>
              <img src={module.image} alt={module.title} />
              <h3 className={styles.moduleTitle}>{module.title}</h3>
              <p className={styles.moduleDesc}>{module.description}</p>
              <Link to={module.link} className={styles.readMoreLink}>
                Read Chapter &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Interactive Textbook | ${siteConfig.title}`}
      description="The definitive guide to building Agentic AI and Humanoid Robots.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CurriculumSection />
      </main>
    </Layout>
  );
}
