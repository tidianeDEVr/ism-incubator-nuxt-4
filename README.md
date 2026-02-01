# ISM Incubator

Plateforme de gestion de hackathons pour l'Institut Superieur de Management (ISM). Cette application permet d'organiser des hackathons, de gerer les soumissions de projets, d'assigner des mentors et de suivre la progression des participants.

## Fonctionnalites

### Public
- Page d'accueil presentant les hackathons
- Liste des hackathons disponibles
- Details des hackathons (reglement, prix, calendrier)
- Page des mentors
- Page des partenaires
- Palmares et realisations

### Participant
- Tableau de bord personnalise
- Inscription aux hackathons
- Soumission de projets
- Suivi du statut des projets
- Messagerie avec les mentors

### Mentor
- Tableau de bord mentor
- Liste des projets assignes
- Accompagnement des equipes
- Messagerie avec les participants

### Admin
- Gestion des hackathons (CRUD)
- Pipeline de validation des projets (Soumis → Evaluation → Accepte/Refuse)
- Attribution des mentors aux projets
- Notifications aux participants
- Gestion des messages
- Classement et attribution des prix

## Stack Technique

- **Framework**: [Nuxt 4](https://nuxt.com/) avec Vue 3
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Validation**: [VeeValidate](https://vee-validate.logaretm.com/) + [Zod](https://zod.dev/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Utilities**: [VueUse](https://vueuse.org/)
- **Date**: [Day.js](https://day.js.org/)

## Installation

```bash
# Cloner le projet
git clone <repository-url>
cd ism-project

# Installer les dependances
npm install
```

## Developpement

```bash
# Lancer le serveur de developpement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Production

```bash
# Build pour la production
npm run build

# Preview du build
npm run preview
```

## Structure du Projet

```
app/
├── components/       # Composants Vue reutilisables
│   ├── common/       # Composants communs (HackathonCard, etc.)
│   ├── home/         # Composants de la page d'accueil
│   ├── layout/       # Header, Footer, Sidebar
│   └── ui/           # Composants UI (Button, Card, Modal, etc.)
├── layouts/          # Layouts (default, dashboard)
├── pages/            # Pages de l'application
│   ├── admin/        # Pages administration
│   ├── mentor/       # Pages mentor
│   ├── participant/  # Pages participant
│   └── hackathons/   # Pages publiques hackathons
├── data/             # Donnees mock
├── types/            # Types TypeScript
└── assets/           # CSS et assets statiques
```

## Pages Principales

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/hackathons` | Liste des hackathons |
| `/hackathons/:slug` | Detail d'un hackathon |
| `/login` | Connexion |
| `/register` | Inscription |
| `/admin` | Dashboard admin |
| `/admin/hackathons` | Gestion des hackathons |
| `/admin/projects` | Gestion des projets |
| `/participant` | Dashboard participant |
| `/participant/hackathons` | Hackathons du participant |
| `/participant/projects` | Projets du participant |
| `/mentor` | Dashboard mentor |
| `/mentor/projects` | Projets assignes au mentor |

## Composants UI

Le projet inclut une bibliotheque de composants UI reutilisables:

- `UiButton` - Boutons avec variantes
- `UiCard` - Cartes conteneurs
- `UiModal` - Modales
- `UiInput` / `UiTextarea` - Champs de formulaire
- `UiBadge` - Badges de statut
- `UiAvatar` - Avatars utilisateurs
- `UiTable` - Tableaux de donnees
- `UiPipeline` - Vue Kanban/Pipeline
- `UiTabs` - Onglets
- Et plus...

## Contribution

1. Creer une branche pour votre fonctionnalite
2. Commiter vos changements
3. Ouvrir une Pull Request

## Licence

Projet prive - ISM Dakar
