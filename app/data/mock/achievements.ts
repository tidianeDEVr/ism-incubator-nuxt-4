import type { Achievement } from "~/types";

export const mockAchievements: Achievement[] = [
  {
    id: "ach-001",
    projectTitle: "PaySahel",
    teamName: "Team Sahel",
    hackathonTitle: "FinTech Challenge 2025",
    position: 1,
    year: 2025,
    description:
      "Solution de paiement mobile pour les zones rurales sans acces bancaire. Integration avec les reseaux mobile money et support hors-ligne.",
    image: "p1.jpg",
    members: [
      { name: "Aminata Diallo" },
      { name: "Moussa Ndiaye" },
      { name: "Fatou Sow" },
    ],
  },
  {
    id: "ach-002",
    projectTitle: "AgriConnect",
    teamName: "Les Cultivateurs Digitaux",
    hackathonTitle: "Innovation Challenge 2025",
    position: 1,
    year: 2025,
    description:
      "Plateforme connectant directement les agriculteurs aux acheteurs, eliminant les intermediaires et augmentant les revenus des producteurs.",
    image: "p2.jpg",
    members: [{ name: "Ibrahima Fall" }, { name: "Aissatou Ba" }],
  },
  {
    id: "ach-003",
    projectTitle: "EduTech Senegal",
    teamName: "Digital Learners",
    hackathonTitle: "EdTech Hackathon 2024",
    position: 1,
    year: 2024,
    description:
      "Application d'apprentissage adaptatif utilisant l'IA pour personnaliser le parcours educatif des eleves du secondaire.",
    image: "p3.jpg",
    members: [
      { name: "Omar Diop" },
      { name: "Mariama Sy" },
      { name: "Cheikh Gueye" },
      { name: "Ndeye Awa" },
    ],
  },
  {
    id: "ach-004",
    projectTitle: "HealthTrack",
    teamName: "MedTech Innovators",
    hackathonTitle: "Health Innovation 2024",
    position: 2,
    year: 2024,
    description:
      "Systeme de suivi medical pour les patients chroniques avec alertes automatiques et telemedicine integree.",
    image: "p4.jpg",
    members: [{ name: "Dr. Abdou Kane" }, { name: "Sophie Mendy" }],
  },
  {
    id: "ach-005",
    projectTitle: "WasteWise",
    teamName: "Green Warriors",
    hackathonTitle: "GreenTech Challenge 2024",
    position: 1,
    year: 2024,
    description:
      "Application de gestion intelligente des dechets avec gamification pour encourager le tri et le recyclage dans les quartiers.",
    image: "p5.jpg",
    members: [
      { name: "Lamine Toure" },
      { name: "Khady Diouf" },
      { name: "Pape Seck" },
    ],
  },
  {
    id: "ach-006",
    projectTitle: "TransportPlus",
    teamName: "Mobility Team",
    hackathonTitle: "Smart City Hackathon 2023",
    position: 1,
    year: 2023,
    description:
      "Solution de covoiturage optimisee pour Dakar avec prediction de trafic et integration des transports en commun.",
    image: "p6.jpg",
    members: [{ name: "Youssou Ndoye" }, { name: "Rama Fall" }],
  },
];
