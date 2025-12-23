import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Physical AI Curriculum',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=400', 
    description: (
      <>
        Comprehensive guide to building intelligent agents that interact with the physical world.
        From sensors to actuators, we cover it all.
      </>
    ),
  },
  {
    title: 'Humanoid Robotics',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=400',
    description: (
      <>
        Deep dive into the mechanics and control systems of humanoid robots.
        Learn about balance, locomotion, and manipulation.
      </>
    ),
  },
  {
    title: 'Powered by ROS 2',
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=400',
    description: (
      <>
        Built on the Robot Operating System (ROS 2), the industry standard for robotics middleware.
        Master nodes, topics, services, and actions.
      </>
    ),
  },
];

function Feature({image, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={image} className={styles.featureSvg} alt={title} style={{borderRadius: '10px', width: '100%', height: '200px', objectFit: 'cover'}} />
      </div>
      <div className="text--center padding-horiz--md" style={{marginTop: '1rem'}}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
