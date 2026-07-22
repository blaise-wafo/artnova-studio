/* ================================================
   ArtNova Studio — Catalogue des tableaux
   Chaque entrée : id, fichier image, titre, catégorie, prix (FCFA), bestseller
   ================================================ */

const CATALOGUE = [
  { id: "AN-01", file: "tab_01.jpg", title: "Éclat de Turban", category: "portraits", price: 6500 },
  { id: "AN-02", file: "tab_02.jpg", title: "Reine d'Ébène", category: "portraits", price: 7000 },
  { id: "AN-03", file: "tab_03.jpg", title: "Bob Marley — Légende", category: "icones", price: 8500 },
  { id: "AN-04", file: "tab_04.jpg", title: "Kobe — Mamba Mentality", category: "icones", price: 8000 },
  { id: "AN-05", file: "tab_05.jpg", title: "Ronaldo — Numéro 7", category: "icones", price: 8000 },
  { id: "AN-06", file: "tab_06.jpg", title: "Lion Royal", category: "animaux", price: 7500 },
  { id: "AN-07", file: "tab_07.jpg", title: "Tigre Ardent", category: "animaux", price: 7000 },
  { id: "AN-08", file: "tab_08.jpg", title: "Naruto — Esprit du Feu", category: "icones", price: 7500 },
  { id: "AN-09", file: "tab_09.jpg", title: "Silhouette d'Élégance", category: "portraits", price: 6000 },
  { id: "AN-10", file: "tab_10.jpg", title: "Ara Tropical", category: "animaux", price: 6000 },
  { id: "AN-11", file: "tab_11.jpg", title: "Style Urbain", category: "portraits", price: 5500 },
  { id: "AN-12", file: "tab_12.jpg", title: "Couronne Afro", category: "portraits", price: 6500 },
  { id: "AN-13", file: "tab_13.jpg", title: "Rue de Cameroun", category: "paysages", price: 4000 },
  { id: "AN-14", file: "tab_14.jpg", title: "Envol de Skate", category: "icones", price: 6000 },
  { id: "AN-15", file: "tab_15.jpg", title: "Mona Lisa Revisitée", category: "icones", price: 7000 },
  { id: "AN-16", file: "tab_16.jpg", title: "Astronaute Solitaire", category: "icones", price: 6500 },
  { id: "AN-17", file: "tab_17.jpg", title: "Regard du Loup", category: "animaux", price: 7000 },
  { id: "AN-18", file: "tab_18.jpg", title: "Bulle Rose", category: "portraits", price: 6000 },
  { id: "AN-19", file: "tab_19.jpg", title: "Sous la Pluie", category: "paysages", price: 4500 },
  { id: "AN-20", file: "tab_20.jpg", title: "Coucher Tropical", category: "paysages", price: 4500 },
  { id: "AN-21", file: "top_astronaut-doll.jpg", title: "Petit Astronaute", category: "icones", price: 9000, bestseller: true },
  { id: "AN-22", file: "top_backpack-boy.jpg", title: "Esprit Urbain", category: "icones", price: 9000, bestseller: true },
  { id: "AN-23", file: "top_naruto-boy.jpg", title: "Figurine Pop Art", category: "icones", price: 9500, bestseller: true },
  { id: "AN-24", file: "top_stove-kaws-controller.jpg", title: "Console Néon", category: "icones", price: 10000, bestseller: true },
];

const CATEGORY_LABELS = {
  tous: "Tous",
  portraits: "Portraits",
  icones: "Icônes",
  animaux: "Animaux",
  paysages: "Paysages",
};
