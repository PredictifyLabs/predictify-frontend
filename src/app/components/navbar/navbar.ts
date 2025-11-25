import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [
    NzMenuModule,
    NzBadgeModule,
    NzLayoutModule,
    NzInputModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  selectedCategory: string = 'all';
  searchQuery: string = '';

  selectCategory(category: string): void {
    this.selectedCategory = category;
    console.log('Categoría seleccionada:', category);
    // Aquí implementarías la lógica de filtrado por categoría
  }

  filterByType(type: string): void {
    console.log('Filtrar por tipo:', type);
    // Aquí implementarías la lógica de filtrado por tipo
  }

  filterByLocation(location: string): void {
    console.log('Filtrar por ubicación:', location);
    // Aquí implementarías la lógica de filtrado por ubicación
  }

  navigate(route: string): void {
    console.log('Navegar a:', route);
    // Aquí implementarías la navegación con Router
  }

  search(): void {
    console.log('Buscar:', this.searchQuery);
    // Aquí implementarías la lógica de búsqueda
  }

  logout(): void {
    console.log('Cerrando sesión...');
    // Aquí implementarías la lógica de logout
  }
}
