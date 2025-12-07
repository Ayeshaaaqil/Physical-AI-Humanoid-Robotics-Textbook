---
id: 4
title: Create Robotics Curriculum Plan
stage: plan
date: 2025-12-04
surface: agent
model: claude-opus-4-5-20251101
feature: robotics-curriculum
branch: 1-robotics-curriculum
user: user
command: /sp.plan
labels: [plan, feature-creation, robotics-curriculum]
links:
  spec: specs/1-robotics-curriculum/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-robotics-curriculum/plan.md
tests:
  null
---

## Prompt

```text
/sp.plan

Create:
- End-to-end Physical AI curriculum architecture sketch mapping:
  Student → Simulation → AI Training → Edge Deployment → Physical Robot → Docusaurus Knowledge Portal
- Section structure for curriculum content, labs, and simulations
- Research approach combining robotics validation + phased curriculum writing
- Quality validation framework for simulations, ROS packages, and published documentation

Architecture sketch:
Phase 1 — Research & Foundations
- Physical AI theory and embodied intelligence literature review
- ROS 2 + NVIDIA Isaac + Gazebo official documentation study
- Content drafting in Markdown for Docusaurus

Phase 2 — Digital Twin & Simulation
- URDF modeling
- Gazebo & Unity simulation building
- Isaac Sim synthetic dataset generation
- Lab instructions authored as Docusaurus docs modules

Phase 3 — AI–Robot Integration
- ROS 2 nodes and launch files
- Isaac ROS VSLAM & perception stack
- Nav2 humanoid path planning
- Voice-to-Action pipelines (Whisper + LLM planners)
- Interactive walkthroughs published on Docusaurus

Phase 4 — Edge Deployment
- Jetson Orin environment configuration labs
- Sim-to-real transfer testing
- Docusaurus guides for deployment reproducibility

Phase 5 — Capstone Assessment
- Full humanoid demo design
- Rubrics and checklists publication via Docusaurus

Section structure:
- Introduction to Physical AI
- Robotic Nervous System — ROS 2
- Digital Twin — Gazebo and Unity
- AI Brain — NVIDIA Isaac
- Vision–Language–Action Control
- Edge Deployment on Jetson
- Capstone Project Playbook
- Learning Outcomes & ROI Analysis

Research approach:
- Research-concurrent development: study → simulate → document → publish in parallel
- Each technical section must include:
  - Academic references (APA)
  - Working ROS or simulation example
  - Replication guide hosted on Docusaurus
- Sources:
  - Peer-reviewed robotics literature
  - Official documentation (ROS, NVIDIA Isaac, Gazebo, Unity)

Docusaurus publishing pipeline:
- Markdown source stored in /docs and /blog folders
- Each module published as a Docusaurus doc section
- Lab manuals as step-by-step tutorials
- Embedded diagrams and media assets
- Versioned docs per quarter/release
- Capstone and assessment rubrics published as protected pages
- Student feedback forms linked to evaluation pages

Quality validation:
Written content:
- APA citation audits
- Plagiarism checks (0%)
- Student readability score checks

Technical content:
- ROS packages tested locally
- Gazebo & Isaac simulations validated
- Jetson deployment benchmarks documented
- VLA pipelines validated end-to-end

Docusaurus checks:
- Build must pass without errors
- All internal links verified
- Doc versioning tags applied
- Navigation sidebar logic tested

Decisions needing documentation:
- Host docs: GitHub Pages vs Vercel
- Versioning strategy per cohort
- Open vs gated student content
- Diagram format: Mermaid vs SVG
- Media embedding: local vs CDN
- Blog vs docs split for research vs labs

Testing strategy:
Acceptance criteria:
- Simulated humanoid completes a navigation task without collisions
- ROS nodes compile and pass execution logs
- Jetson inference latency ≤ real-time thresholds
- Voice commands produce correct ROS action chains
- Docusaurus site builds, deploys, and renders modules successfully
- Capstone content accessible and reproducible via online docs
```

## Response snapshot

The implementation plan for the "Physical AI & Humanoid Robotics Curriculum & Research Program" has been created and saved to `specs/1-robotics-curriculum/plan.md`.

Several architectural decisions were identified that should be documented in Architectural Decision Records (ADRs). These include decisions on documentation hosting, curriculum versioning, content access, diagramming format, media embedding, and content organization.

Here are the suggested ADRs:
- 📋 Architectural decision detected: Documentation hosting platform — Document reasoning and tradeoffs? Run `/sp.adr "Documentation Hosting Platform"`
- 📋 Architectural decision detected: Curriculum versioning strategy — Document reasoning and tradeoffs? Run `/sp.adr "Curriculum Versioning Strategy"`
- 📋 Architectural decision detected: Student content access policy — Document reasoning and tradeoffs? Run `/sp.adr "Student Content Access Policy"`
- 📋 Architectural decision detected: Diagramming format for documentation — Document reasoning and tradeoffs? Run `/sp.adr "Diagramming Format"`
- 📋 Architectural decision detected: Media embedding strategy — Document reasoning and tradeoffs? Run `/sp.adr "Media Embedding Strategy"`
- 📋 Architectural decision detected: Content organization (Blog vs Docs) — Document reasoning and tradeoffs? Run `/sp.adr "Content Organization"`

The plan is now ready for review. You can proceed to create tasks using `/sp.tasks` or document the architectural decisions with `/sp.adr`.

## Outcome

- ✅ Impact: Implementation plan created and saved to `specs/1-robotics-curriculum/plan.md`.
- 🧪 Tests: No automated tests run; plan generation and constitution checks performed.
- 📁 Files: `specs/1-robotics-curriculum/plan.md` created.
- 🔁 Next prompts: User to review plan, create ADRs, or proceed with `/sp.tasks`.
- 🧠 Reflection: Successfully generated the implementation plan by integrating user input with the template and constitution. Identified several key architectural decisions for ADR creation. The PowerShell script failure was handled by manual path setting.

## Evaluation notes (flywheel)

- Failure modes observed: `setup-plan.ps1` script failed to execute due to `pwsh` not found.
- Graders run and results (PASS/FAIL): Manual plan generation and constitution check (PASS).
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Improve script execution reliability or make agent-native file operations the primary method for such tasks.
