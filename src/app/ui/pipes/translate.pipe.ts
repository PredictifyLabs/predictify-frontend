import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '../../infrastructure/services/translate.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  transform(key: string): string {
    return this.translateService.t(key);
  }
}
