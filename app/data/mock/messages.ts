export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: 'admin' | 'mentor' | 'participant'
  senderAvatar?: string
  recipientId: string
  recipientName: string
  subject?: string
  content: string
  read: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participantIds: string[]
  participants: {
    id: string
    name: string
    role: 'admin' | 'mentor' | 'participant'
    avatar?: string
  }[]
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participantIds: ['admin-001', 'mentor-001'],
    participants: [
      { id: 'admin-001', name: 'Admin ISM', role: 'admin' },
      { id: 'mentor-001', name: 'Dr. Mamadou Diallo', role: 'mentor' },
    ],
    lastMessage: 'Merci pour votre retour sur le projet FinApp.',
    lastMessageAt: '2026-01-30T14:30:00Z',
    unreadCount: 2,
  },
  {
    id: 'conv-002',
    participantIds: ['admin-001', 'user-p1'],
    participants: [
      { id: 'admin-001', name: 'Admin ISM', role: 'admin' },
      { id: 'user-p1', name: 'Amadou Diop', role: 'participant' },
    ],
    lastMessage: 'Notre equipe a bien recu les commentaires du jury.',
    lastMessageAt: '2026-01-30T10:15:00Z',
    unreadCount: 0,
  },
  {
    id: 'conv-003',
    participantIds: ['admin-001', 'mentor-002'],
    participants: [
      { id: 'admin-001', name: 'Admin ISM', role: 'admin' },
      { id: 'mentor-002', name: 'Fatou Ndiaye', role: 'mentor' },
    ],
    lastMessage: 'Quand est prevu le prochain jury ?',
    lastMessageAt: '2026-01-29T16:45:00Z',
    unreadCount: 1,
  },
  {
    id: 'conv-004',
    participantIds: ['admin-001', 'user-p6'],
    participants: [
      { id: 'admin-001', name: 'Admin ISM', role: 'admin' },
      { id: 'user-p6', name: 'Oumar Kane', role: 'participant' },
    ],
    lastMessage: 'Le pitch deck a ete mis a jour comme demande.',
    lastMessageAt: '2026-01-28T09:00:00Z',
    unreadCount: 0,
  },
  {
    id: 'conv-005',
    participantIds: ['admin-001', 'mentor-003'],
    participants: [
      { id: 'admin-001', name: 'Admin ISM', role: 'admin' },
      { id: 'mentor-003', name: 'Ousmane Ba', role: 'mentor' },
    ],
    lastMessage: 'Je confirme ma disponibilite pour la session de mentorat.',
    lastMessageAt: '2026-01-27T11:30:00Z',
    unreadCount: 0,
  },
]

export const mockMessages: Message[] = [
  {
    id: 'msg-001',
    senderId: 'mentor-001',
    senderName: 'Dr. Mamadou Diallo',
    senderRole: 'mentor',
    recipientId: 'admin-001',
    recipientName: 'Admin ISM',
    content: 'Bonjour, j\'ai termine l\'evaluation du projet FinApp. L\'equipe a fait un excellent travail sur le MVP.',
    read: true,
    createdAt: '2026-01-30T14:00:00Z',
  },
  {
    id: 'msg-002',
    senderId: 'admin-001',
    senderName: 'Admin ISM',
    senderRole: 'admin',
    recipientId: 'mentor-001',
    recipientName: 'Dr. Mamadou Diallo',
    content: 'Merci pour votre retour. Pouvez-vous soumettre votre grille d\'evaluation d\'ici vendredi ?',
    read: true,
    createdAt: '2026-01-30T14:15:00Z',
  },
  {
    id: 'msg-003',
    senderId: 'mentor-001',
    senderName: 'Dr. Mamadou Diallo',
    senderRole: 'mentor',
    recipientId: 'admin-001',
    recipientName: 'Admin ISM',
    content: 'Oui bien sur, je vous l\'envoie demain matin.',
    read: false,
    createdAt: '2026-01-30T14:30:00Z',
  },
]
