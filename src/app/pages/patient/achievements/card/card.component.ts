import { Component, computed, input } from '@angular/core';
import { AchievementModel, AchievementRarity } from 'src/app/shared/models/achievement.model';
import { CommonModule } from '@angular/common';

@Component({
    imports: [CommonModule],
    selector: 'app-achievement-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class AchievementCardComponent {
    achievement = input.required<AchievementModel>();
    currentValue = input<number>(0);
    targetValue = input<number>(0);
    progressPercentage = input<number>(0);
    trackType = input<'STREAK' | 'COUNTER' | null>(null);

    selectedI18n = computed(() => this.achievement().i18n['pt-BR']);
    name = computed(() => this.selectedI18n().name);
    description = computed(() => this.selectedI18n().description);
    unlocked = computed(() => this.achievement().unlockedAt != null);
    
    rarityLabel = computed(() => {
        switch (this.achievement().rarity) {
            case AchievementRarity.COMMON: return 'Comum';
            case AchievementRarity.RARE: return 'Raro';
            case AchievementRarity.EPIC: return 'Épico';
            case AchievementRarity.LEGENDARY: return 'Lendário';
            case AchievementRarity.QUESTNUTRI_MASTER: return 'Mestre';
            default: return '';
        }
    });

    rarityBadgeClass = computed(() => {
        switch (this.achievement().rarity) {
            case AchievementRarity.COMMON: return 'bg-gray-200 text-gray-600';
            case AchievementRarity.RARE: return 'bg-blue-100 text-blue-600';
            case AchievementRarity.EPIC: return 'bg-purple-100 text-purple-600';
            case AchievementRarity.LEGENDARY: return 'bg-yellow-100 text-yellow-600';
            case AchievementRarity.QUESTNUTRI_MASTER: return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
            default: return '';
        }
    });

    iconBgClass = computed(() => {
        const rarity = this.achievement().rarity;
        const isUnlocked = this.unlocked();

        if (!isUnlocked) {
            switch (rarity) {
                case AchievementRarity.COMMON: return 'bg-gradient-to-br from-gray-300 to-gray-400';
                case AchievementRarity.RARE: return 'bg-gradient-to-br from-gray-300 to-blue-300';
                case AchievementRarity.EPIC: return 'bg-gradient-to-br from-gray-300 to-purple-300';
                case AchievementRarity.LEGENDARY: return 'bg-gradient-to-br from-gray-300 to-yellow-300';
                case AchievementRarity.QUESTNUTRI_MASTER: return 'bg-gradient-to-br from-gray-300 to-pink-300';
                default: return 'bg-gray-300';
            }
        }

        switch (rarity) {
            case AchievementRarity.COMMON: return 'bg-gradient-to-br from-gray-400 to-gray-500 icon-unlocked';
            case AchievementRarity.RARE: return 'bg-gradient-to-br from-blue-400 to-blue-600 icon-unlocked';
            case AchievementRarity.EPIC: return 'bg-gradient-to-br from-purple-400 to-purple-600 icon-unlocked';
            case AchievementRarity.LEGENDARY: return 'bg-gradient-to-br from-yellow-400 to-amber-500 icon-unlocked';
            case AchievementRarity.QUESTNUTRI_MASTER: return 'bg-gradient-to-br from-purple-500 to-pink-500 icon-unlocked';
            default: return 'bg-gray-400';
        }
    });

    progressBarClass = computed(() => {
        switch (this.achievement().rarity) {
            case AchievementRarity.COMMON: return 'bg-gray-400';
            case AchievementRarity.RARE: return 'bg-blue-500';
            case AchievementRarity.EPIC: return 'bg-purple-500';
            case AchievementRarity.LEGENDARY: return 'bg-yellow-500';
            case AchievementRarity.QUESTNUTRI_MASTER: return 'bg-gradient-to-r from-purple-500 to-pink-500';
            default: return 'bg-gray-400';
        }
    });

    trackTypeLabel = computed(() => {
        switch (this.trackType()) {
            case 'STREAK': return 'Sequência';
            case 'COUNTER': return 'Contador';
            default: return '';
        }
    });

    unlockedDate = computed(() => {
        const date = this.achievement().unlockedAt;
        if (!date) return null;
        return new Date(date).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    });
}