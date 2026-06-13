import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { ProtectedRoute } from '@/shared/routes/ProtectedRoute'
import { RoleRoute } from '@/shared/routes/RoleRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { PlayersListPage } from '@/features/players/pages/PlayersListPage'
import { PlayerDetailPage } from '@/features/players/pages/PlayerDetailPage'
import { PlayerCreatePage } from '@/features/players/pages/PlayerCreatePage'
import { PlayerEditPage } from '@/features/players/pages/PlayerEditPage'
import { MyProfilePage } from '@/features/players/pages/MyProfilePage'
import { CoachesListPage } from '@/features/coaches/pages/CoachesListPage'
import { CoachDetailPage } from '@/features/coaches/pages/CoachDetailPage'
import { CoachCreatePage } from '@/features/coaches/pages/CoachCreatePage'
import { CoachEditPage } from '@/features/coaches/pages/CoachEditPage'
import { TeamsListPage } from '@/features/teams/pages/TeamsListPage'
import { TeamDetailPage } from '@/features/teams/pages/TeamDetailPage'
import { TeamCreatePage } from '@/features/teams/pages/TeamCreatePage'
import { TeamEditPage } from '@/features/teams/pages/TeamEditPage'
import { MyTeamPage } from '@/features/teams/pages/MyTeamPage'
import { SessionsListPage } from '@/features/sessions/pages/SessionsListPage'
import { SessionDetailPage } from '@/features/sessions/pages/SessionDetailPage'
import { SessionCreatePage } from '@/features/sessions/pages/SessionCreatePage'
import { SessionEditPage } from '@/features/sessions/pages/SessionEditPage'
import { MySchedulePage } from '@/features/sessions/pages/MySchedulePage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forbidden',
    element: <ForbiddenPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            element: <RoleRoute roles={['ADMIN', 'COACH']} />,
            children: [
              { path: 'teams', element: <TeamsListPage /> },
              { path: 'teams/:id', element: <TeamDetailPage /> },
              { path: 'players', element: <PlayersListPage /> },
              { path: 'players/:id', element: <PlayerDetailPage /> },
              { path: 'coaches', element: <CoachesListPage /> },
              { path: 'coaches/:id', element: <CoachDetailPage /> },
              { path: 'sessions', element: <SessionsListPage /> },
              { path: 'sessions/new', element: <SessionCreatePage /> },
              { path: 'sessions/:id/edit', element: <SessionEditPage /> },
            ],
          },
          {
            element: <RoleRoute roles={['ADMIN']} />,
            children: [
              { path: 'players/new', element: <PlayerCreatePage /> },
              { path: 'players/:id/edit', element: <PlayerEditPage /> },
              { path: 'coaches/new', element: <CoachCreatePage /> },
              { path: 'coaches/:id/edit', element: <CoachEditPage /> },
              { path: 'teams/new', element: <TeamCreatePage /> },
              { path: 'teams/:id/edit', element: <TeamEditPage /> },
            ],
          },
          {
            element: <RoleRoute roles={['ADMIN', 'COACH', 'PLAYER']} />,
            children: [{ path: 'sessions/:id', element: <SessionDetailPage /> }],
          },
          {
            element: <RoleRoute roles={['PLAYER']} />,
            children: [
              { path: 'me', element: <MyProfilePage /> },
              { path: 'me/team', element: <MyTeamPage /> },
              { path: 'me/schedule', element: <MySchedulePage /> },
            ],
          },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
