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