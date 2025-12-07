---
id: 1
title: Update Project Constitution
stage: constitution
date: 2025-12-04
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: user
command: /sp.constitution
labels: [constitution, project-setup]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  null
---

## Prompt

```text
/sp.constitution

Project: Physical AI & Humanoid Robotics Curriculum and Capstone Program

Core principles:
- Technical accuracy based on robotics and AI primary sources (ROS 2, Gazebo, NVIDIA Isaac, VLA research)
- Clarity for advanced students with AI, robotics, or computer science backgrounds
- Reproducibility: all simulations, workflows, and training pipelines must be well-documented and repeatable
- Real-world alignment: simulated outputs must be transferable to edge hardware (Jetson, real sensors, ROS 2 robots)
- Safety-first design for human–robot interaction

Key standards:
- All technical claims must be traceable to official documentation or peer-reviewed robotics research
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

Constraints:
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

Success criteria:
- Every module verified against real ROS/Isaac workflows
- All learning outcomes mapped to hands-on lab exercises
- Sim-to-real demonstrations validated on Jetson hardware
- Zero plagiarism detected
- Fact-checking and safety review passed prior to publication
```

## Response snapshot

The project constitution has been updated to version 1.0.0. This is a MAJOR version bump as this is the initial definition of the project's core principles and governance.

The following files should be manually reviewed to ensure full alignment with the new constitution:
- `.specify/templates/plan-template.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/tasks-template.md`
- Any command files under `.specify/templates/commands/` (if they exist in your project)

Suggested commit message:
`docs: amend constitution to v1.0.0 (initial definition of principles)`

## Outcome

- ✅ Impact: Project constitution defined and updated.
- 🧪 Tests: No automated tests run for constitution update.
- 📁 Files: .specify/memory/constitution.md modified.
- 🔁 Next prompts: User to review updated constitution and relevant templates.
- 🧠 Reflection: Successfully updated constitution and initiated consistency check with templates. PHR created using agent-native flow due to script not found.

## Evaluation notes (flywheel)

- Failure modes observed: `create-phr.sh` script not found, requiring agent-native PHR creation.
- Graders run and results (PASS/FAIL): null
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Verify the presence and path of `create-phr.sh` script in future runs, or update documentation/tools to correctly reflect agent-native PHR creation as primary if script is not intended to be used.
