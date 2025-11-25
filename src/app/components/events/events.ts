import { Component } from '@angular/core';
import { EventCard } from './event-card/event-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  imports: [EventCard, CommonModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {
  events = [
    {title: 'Hackaton Puerta Del Sol', date: '2025-11-26', description: 'En este evento se haran concursos sobre Desarrollo web' },
    {title: 'TechCaribe', date: '2025-11-26', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra justo sed posuere consequat. Sed eget fringilla ante, sagittis aliquet nisi. Sed nec ipsum dignissim,' },
    {title: 'Ingenieros en Accion', date: '2025-11-26', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra justo sed posuere consequat. Sed eget fringilla ante, sagittis aliquet nisi.' },
    {title: 'Windsurf', date: '2025-11-26', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra justo sed posuere consequat.' },
    {title: 'Windsurf', date: '2025-11-26', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra justo sed posuere consequat.' },
    {title: 'Windsurf', date: '2025-11-26', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra justo sed posuere consequat.' },
    {title: 'Windsurf', date: '2025-11-26', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra justo sed posuere consequat.' }
  ]
}
