// Types miroirs des réponses du backend (ma.academy.*.infrastructure.web.dto)

export type Category = 'U12' | 'U13' | 'U14' | 'U15' | 'U16' | 'U17'

export const CATEGORIES: Category[] = ['U12', 'U13', 'U14', 'U15', 'U16', 'U17']

export type Role = 'ADMIN' | 'COACH' | 'PLAYER'

export interface PlayerResponse {
  id: string
  firstName: string
  lastName: string
  category: Category
  heightCm: number | null
  weightKg: number | null
  photoUrl: string | null
  teamId: string | null
  createdAt: string
  updatedAt: string
}

export interface CoachResponse {
  id: string
  firstName: string
  lastName: string
  diploma: string | null
  photoUrl: string | null
  categories: Category[]
  createdAt: string
  updatedAt: string
}

export interface TeamResponse {
  id: string
  name: string
  category: Category
  coachId: string
  createdAt: string
  updatedAt: string
}

export interface TeamCoachSummary {
  id: string
  firstName: string
  lastName: string
  photoUrl: string | null
}

export interface TeamPlayerSummary {
  id: string
  firstName: string
  lastName: string
  category: Category
  photoUrl: string | null
}

export interface TeamDetailResponse {
  id: string
  name: string
  category: Category
  coachId: string
  coach: TeamCoachSummary
  players: TeamPlayerSummary[]
  createdAt: string
  updatedAt: string
}

export interface SessionResponse {
  id: string
  teamId: string
  startDateTime: string
  endDateTime: string
  location: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface SessionTeamSummary {
  id: string
  name: string
  category: Category
}

export interface SessionDetailResponse {
  id: string
  teamId: string
  startDateTime: string
  endDateTime: string
  location: string
  notes: string | null
  team: SessionTeamSummary
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface CoachSummary {
  id: string
  firstName: string
  lastName: string
  photoUrl: string | null
}

export interface PlayerSummary {
  id: string
  firstName: string
  lastName: string
  category: Category
  photoUrl: string | null
}

export interface MeResponse {
  userId: string
  username: string
  role: Role
  profile: CoachSummary | PlayerSummary | null
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  user: MeResponse
}
