import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';

@Component({
    selector: 'app-real-landing',
    templateUrl: './real-landing.html',
    styleUrls: ['./real-landing.scss'],
    imports: [
        RouterLink,
        CarouselModule
    ]
})
export class RealLandingComponent {
    scrollToSection(event: Event, sectionId: string): void {
        event.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}