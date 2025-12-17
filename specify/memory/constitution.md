<!--
Sync Impact Report:
Version change: 0.0.0 → 1.0.0 (MAJOR: Initial version creation)
Modified principles:
  - [PRINCIPLE_1_NAME] → Technical Accuracy
  - [PRINCIPLE_2_NAME] → Clarity for Advanced Students
  - [PRINCIPLE_3_NAME] → Reproducibility
  - [PRINCIPLE_4_NAME] → Real-World Alignment
  - [PRINCIPLE_5_NAME] → Safety-First Design
Added sections: Key Standards, Constraints
Removed sections: None (Principle 6 and its description removed as not provided)
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending
  - .specify/templates/spec-template.md ⚠ pending
  - .specify/templates/tasks-template.md ⚠ pending
  - .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: None
-->
# Physical AI & Humanoid Robotics Curriculum and Capstone Program Constitution

## Core Principles

### Technical Accuracy
Technical accuracy based on robotics and AI primary sources (ROS 2, Gazebo, NVIDIA Isaac, VLA research).

### Clarity for Advanced Students
Clarity for advanced students with AI, robotics, or computer science backgrounds.

### Reproducibility
All simulations, workflows, and training pipelines must be well-documented and repeatable.

### Real-World Alignment
Simulated outputs must be transferable to edge hardware (Jetson, real sensors, ROS 2 robots).

### Safety-First Design
Safety-first design for human–robot interaction.

## Key Standards

- All technical claims must be traceable to official documentation or
  peer-reviewed robotics research
- Reference format: APA style (IEEE allowed for technical sections)
- Source types:
  - Minimum 50% primary documentation or peer-reviewed robotics/AI papers
  - Remaining sources from official vendor docs (ROS, NVIDIA, Gazebo, Unity)
- Validation:
  - All ROS node examples must compile successfully
  - Gazebo/Isaac simulations must run without physics or sensor errors
  - VLA pipelines must demonstrate voice-to-robot action flow
- Writing clarity:
  - Student-friendly academic tone (Flesch-Kincaid grade 11–13)
  - Diagrams and pseudocode where complexity is high
- Ethics:
  - AI safety discussion mandatory
  - Responsible robotics use policies referenced

## Constraints

- Course coverage:
  - ROS 2 middleware and humanoid URDF development
  - Gazebo + Unity digital twin simulations
  - NVIDIA Isaac Sim and Isaac ROS perception stacks
  - Vision-Language-Action integrations (Whisper + LLM planners)
- Hardware realism:
  - Edge computing deployment using NVIDIA Jetson Orin
  - Sensor integration (RealSense cameras, IMUs, LIDAR)
  - Proxy robots or miniature humanoids for physical validation
- Output length:
  - Curriculum + technical guide: 6,000–8,000 words total
- Source minimum:
  - At least 20 cited sources
- Deliverable formats:
  - PDF technical guide
  - Markdown course modules
  - ROS package examples and simulation launch files

## Governance

The constitution supersedes all other practices and guidelines. Amendments require
clear documentation, explicit approval from stakeholders, and a planned migration
strategy if significant changes are introduced. Compliance with these principles
and standards is verified through:
- Every module verified against real ROS/Isaac workflows
- All learning outcomes mapped to hands-on lab exercises
- Sim-to-real demonstrations validated on Jetson hardware
- Zero plagiarism detected
- Fact-checking and safety review passed prior to publication

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04
