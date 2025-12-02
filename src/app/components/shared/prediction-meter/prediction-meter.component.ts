import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionLevel, getPredictionColor, getPredictionLabel, getPredictionIcon } from '../../../models/prediction.model';

@Component({
  selector: 'app-prediction-meter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-meter.component.html',
  styleUrls: ['./prediction-meter.component.css']
})
export class PredictionMeterComponent implements OnInit {
  @Input() probability: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'circular' | 'linear' | 'compact' = 'linear';
  @Input() showLabel: boolean = true;
  @Input() animated: boolean = true;

  level: PredictionLevel = 'medium';
  color: string = '#F59E0B';
  label: string = '';
  icon: string = '';
  
  circumference: number = 283;
  offset: number = 283;

  ngOnInit() {
    this.updatePredictionData();
    if (this.variant === 'circular') {
      this.calculateCircularProgress();
    }
  }

  ngOnChanges() {
    this.updatePredictionData();
    if (this.variant === 'circular') {
      this.calculateCircularProgress();
    }
  }

  private updatePredictionData() {
    this.level = this.getPredictionLevel(this.probability);
    this.color = getPredictionColor(this.level);
    this.label = getPredictionLabel(this.level);
    this.icon = getPredictionIcon(this.level);
  }

  private getPredictionLevel(prob: number): PredictionLevel {
    if (prob >= 70) return 'high';
    if (prob >= 40) return 'medium';
    return 'low';
  }

  private calculateCircularProgress() {
    const radius = 45;
    this.circumference = 2 * Math.PI * radius;
    const progress = this.probability / 100;
    this.offset = this.circumference - (progress * this.circumference);
  }

  getGradient(): string {
    if (this.level === 'high') {
      return 'linear-gradient(90deg, #10B981 0%, #34D399 100%)';
    } else if (this.level === 'medium') {
      return 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)';
    } else {
      return 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)';
    }
  }

  getSizeClass(): string {
    return `size-${this.size}`;
  }
}
