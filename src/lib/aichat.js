// src/lib/aichat.js
// Controller for the full-screen AI Advisor slideshow form
import { animate } from 'motion';
import api from './api.js';
import { imgCard } from '../pages/AIchat.js';
import { addItemToCart } from './cart.js';

const TOTAL_STEPS = 8;

// Labels shown in the review summary
const LABELS = {
  disciplina:          { title: 'DISCIPLINE',     map: { musculacion:'Strength', aerobico:'Cardio', mixta:'Hybrid' } },
  objetivo:            { title: 'GOAL',            map: { volumen:'Bulk', definicion:'Cut', recomposicion:'Recomposition' } },
  nivel:               { title: 'LEVEL',           map: { principiante:'Beginner', intermedio:'Intermediate', avanzado:'Advanced' } },
  diasEntreno:         { title: 'TRAINING DAYS',   map: {} },
  tipoDieta:           { title: 'DIET',            map: { omnivoro:'Omnivore', vegano:'Vegan', flexible:'Flexible' } },
  nivelSuplementacion: { title: 'SUPPLEMENTS',     map: { nada:'None', esencial:'Essential', avanzado:'Advanced' } },
  comidasAlDia:        { title: 'MEALS/DAY',       map: {} },
  horaEntreno:         { title: 'TRAINING TIME',   map: { '08:00':'Morning', '13:00':'Midday', '17:00':'Afternoon', '20:00':'Night' } },
};

const HOUR_LABEL = { '08:00':'Morning (8am)', '13:00':'Midday (1pm)', '17:00':'Afternoon (5pm)', '20:00':'Night (8pm)' };

const IMAGES_TO_PRELOAD = [
  '/assets/advisor/slide1.png',
  '/assets/advisor/slide2.png',
  '/assets/advisor/slide3.png',
  '/assets/advisor/slide4.png',
  '/assets/advisor/slide5.png',
  '/assets/advisor/slide6.png',
  '/assets/advisor/slide7.png',
  '/assets/advisor/slide8.png',
  '/assets/advisor/card_strength.png',
  '/assets/advisor/card_cardio.png',
  '/assets/advisor/card_hybrid.png',
  '/assets/advisor/card_bulk.png',
  '/assets/advisor/card_cut.png',
  '/assets/advisor/card_recomp.png',
  '/assets/advisor/card_stamina.png',
  '/assets/advisor/card_metabolic.png',
  '/assets/advisor/card_vo2max.png',
  '/assets/advisor/card_beginner.png',
  '/assets/advisor/card_intermediate.png',
  '/assets/advisor/card_advanced.png',
  '/assets/advisor/card_days3.png',
  '/assets/advisor/card_days4.png',
  '/assets/advisor/card_days5.png',
  '/assets/advisor/card_days6.png',
  '/assets/advisor/card_omnivore.png',
  '/assets/advisor/card_vegan.png',
  '/assets/advisor/card_flexible.png',
  '/assets/advisor/card_supp_none.png',
  '/assets/advisor/card_supp_essential.png',
  '/assets/advisor/card_supp_advanced.png',
  '/assets/advisor/card_meals3.png',
  '/assets/advisor/card_meals4.png',
  '/assets/advisor/card_meals5.png',
  '/assets/advisor/card_time_morning.png',
  '/assets/advisor/card_time_midday.png',
  '/assets/advisor/card_time_afternoon.png',
  '/assets/advisor/card_time_night.png',
];

const preloadAdvisorImages = () => {
  if (typeof window === 'undefined') return;
  IMAGES_TO_PRELOAD.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};