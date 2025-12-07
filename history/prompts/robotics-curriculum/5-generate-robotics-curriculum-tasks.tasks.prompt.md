---
id: 5
title: Generate Robotics Curriculum Tasks
stage: tasks
date: 2025-12-04
surface: agent
model: claude-opus-4-5-20251101
feature: robotics-curriculum
branch: 1-robotics-curriculum
user: user
command: /sp.task
labels: [tasks, workflow-generation, robotics-curriculum]
links:
  spec: specs/1-robotics-curriculum/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/1-robotics-curriculum/tasks.md
tests:
  null
---

## Prompt

```text
/sp.task Create a coordinated multi-agent workflow to produce the full
Physical AI & Humanoid Robotics Curriculum for Docusaurus.

Define sub-agents as follows:

1. ResearchAgent
   - Collect peer-reviewed robotics and embodied AI references
   - Summarize ROS 2, Gazebo, Unity, and NVIDIA Isaac official docs
   - Deliver APA citation lists per module

2. CurriculumWriterAgent
   - Write all theory chapters in Markdown
   - Add student-friendly explanations
   - Structure content according to Docusaurus docs format

3. LabManualAgent
   - Create step-by-step Hands-on Labs:
       • ROS2 node writing
       • URDF humanoid modeling
       • Gazebo simulations
       • Isaac Sim environment setup
       • Jetson Orin deployment
       • Whisper + LLM Voice-to-Action pipeline
   - Ensure labs are reproducible

4. ValidationAgent
   - Check all instructions cause no runtime or setup errors
   - Verify technical tool chains
   - Validate safety and realism checks
   - Run plagiarism detection

5. PublishingAgent
   - Organize written content into `/docs` and `/blog`
   - Generate Docusaurus sidebar structures
   - Apply versioning tags
   - Prepare markdown deployment bundles

Execution plan:
- Generate content module-by-module:
   ROS 2 → Gazebo → Isaac → VLA → Jetson → Capstone

Mandatory output:
- APA formatted references per module
- Docusaurus-ready Markdown docs
- Labs with prerequisites and objectives
- Validation checklists
```

## Response snapshot

I have generated the `tasks.md` file for the "Physical AI & Humanoid Robotics Curriculum & Research Program" at `specs/1-robotics-curriculum/tasks.md`. This task list details the coordinated multi-agent workflow for producing the full curriculum, organized by modules and including tasks for research, writing, lab development, validation, and publishing.

## Outcome

- ✅ Impact: `tasks.md` file successfully generated, outlining the curriculum production workflow.
- 🧪 Tests: No automated tests run; manual review of generated tasks performed.
- 📁 Files: `specs/1-robotics-curriculum/tasks.md` created.
- 🔁 Next prompts: User can now proceed with `/sp.analyze` to validate the artifacts or begin execution with `/sp.implement`.
- 🧠 Reflection: Successfully created a comprehensive `tasks.md` based on user's detailed workflow, integrating information from `spec.md` and `plan.md`. Handled `check-prerequisites.ps1` script failure by generating tasks manually.

## Evaluation notes (flywheel)

- Failure modes observed: `check-prerequisites.ps1` script failed to execute.
- Graders run and results (PASS/FAIL): Manual review of `tasks.md` structure and content (PASS).
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Ensure robust script execution or formalize agent-native fallback for artifact generation.
