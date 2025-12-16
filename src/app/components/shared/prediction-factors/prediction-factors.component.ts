import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PredictionFactor } from '../../../models/prediction.model';

@Component({
  selector: 'app-prediction-factors',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './prediction-factors.component.html',
  styleUrls: ['./prediction-factors.component.css']
})
export class PredictionFactorsComponent {
  @Input() factors: PredictionFactor[] = [];
  @Input() maxFactors: number = 5;
  @Input() showWeights: boolean = false;

  get displayedFactors(): PredictionFactor[] {
    return this.factors.slice(0, this.maxFactors);
  }

  get positiveFactors(): PredictionFactor[] {
    return this.displayedFactors.filter(f => f.type === 'positive');
  }

  get negativeFactors(): PredictionFactor[] {
    return this.displayedFactors.filter(f => f.type === 'negative');
  }

  getImpactLabel(impact: string): string {
    const labels: Record<string, string> = {
      'high': 'Alto',
      'medium': 'Medio',
      'low': 'Bajo'
    };
    return labels[impact] || impact;
  }

  getWeightPercentage(weight: number): number {
    return Math.abs(weight * 100);
  }
}
