// User types
export type UserRole = 'admin' | 'mentor' | 'participant'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  createdAt: string
}

// Hackathon types
export type HackathonStatus = 'draft' | 'upcoming' | 'active' | 'evaluation' | 'completed'

export interface HackathonStep {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  order: number
}

export interface Prize {
  position: number
  title: string
  description: string
  value?: string
}

export interface Hackathon {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  coverImage: string
  status: HackathonStatus
  category: string
  registrationStart: string
  registrationEnd: string
  submissionStart: string
  submissionEnd: string
  evaluationStart: string
  evaluationEnd: string
  steps: HackathonStep[]
  prizes: Prize[]
  mentorIds: string[]
  participantCount: number
  projectCount: number
  createdAt: string
  updatedAt: string
}

// Project types
export type ProjectStatus = 'draft' | 'submitted' | 'evaluation' | 'finalist' | 'winner' | 'rejected'

export interface ProjectMember {
  userId: string
  name: string
  role: string
  isLead: boolean
  avatar?: string
}

export interface Project {
  id: string
  hackathonId: string
  title: string
  description: string
  problemStatement: string
  solution: string
  techStack: string[]
  members: ProjectMember[]
  status: ProjectStatus
  pitchDeckUrl?: string
  demoVideoUrl?: string
  sourceCodeUrl?: string
  screenshots: string[]
  assignedMentorId?: string
  submittedAt?: string
  createdAt: string
  updatedAt: string
  // Winner ranking fields
  winnerPosition?: number
  showInSuccessStories?: boolean
}

// Achievement type for past projects
export interface Achievement {
  id: string
  projectTitle: string
  teamName: string
  hackathonTitle: string
  position: number
  year: number
  description: string
  image?: string
  members: { name: string; avatar?: string }[]
}

// Mentor types
export interface Mentor {
  id: string
  userId: string
  name: string
  expertise: string[]
  bio: string
  avatar?: string
  linkedInUrl?: string
  assignedProjectIds: string[]
  isActive: boolean
}
