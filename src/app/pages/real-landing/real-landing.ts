import { Component } from '@angular/core';
import { QnDiv } from '@qn/components/basic';
import { CarouselModule } from 'primeng/carousel';

@Component({
    selector: 'app-real-landing',
    templateUrl: './real-landing.html',
    styleUrls: ['./real-landing.scss'],
    imports: [
        QnDiv,
        CarouselModule
    ]
})
export class RealLandingComponent {
    highlights = [
        {
            title: 'Personalized Diets',
            description: 'AI-powered meal planning that adapts to your unique nutritional needs, preferences, and health goals.',
            icon: '🍽️',
            benefits: ['Custom macro calculations', 'Dietary restriction support', 'Dynamic meal adjustments']
        },
        {
            title: 'Real-Time Monitoring',
            description: 'Track your progress effortlessly with intelligent analytics and visual insights that keep you motivated.',
            icon: '📊',
            benefits: ['Live progress tracking', 'Smart notifications', 'Comprehensive reports']
        },
        {
            title: 'Gamified Experience',
            description: 'Stay engaged with badges, streaks, and achievements that make healthy living fun and rewarding.',
            icon: '🎮',
            benefits: ['Achievement system', 'Progress streaks', 'Social challenges']
        }
    ];

    pricingPlans = [
        {
            name: 'Basic',
            amount: '9.99',
            period: 'month',
            description: 'Perfect for individuals starting their nutrition journey',
            features: ['Meal Tracking', 'Basic Progress Reports', 'Mobile App Access', '24/7 Support'],
            buttonText: 'Start Free Trial',
            featured: false
        },
        {
            name: 'Professional',
            amount: '29.99',
            period: 'month',
            description: 'Ideal for nutritionists and health professionals',
            features: ['Everything in Basic', 'Custom Diet Plans', 'Client Management', 'Advanced Analytics', 'API Access'],
            buttonText: 'Get Started',
            featured: true
        },
        {
            name: 'Enterprise',
            amount: '99.99',
            period: 'month',
            description: 'For clinics and large healthcare organizations',
            features: ['Everything in Professional', 'White-label Solution', 'Priority Support', 'Custom Integrations', 'Dedicated Account Manager'],
            buttonText: 'Contact Sales',
            featured: false
        }
    ];
}