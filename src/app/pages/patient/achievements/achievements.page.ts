import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { AchievementService } from '@qn/services';
import { AchievementModel, AchievementRarity } from 'src/app/shared/models/achievement.model';
import { AchievementCardComponent } from "./card/card.component";
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { GameService } from 'src/app/services/game/game.service';
import { GameTrackModel } from 'src/app/shared/models/track.model';
import { BackButtonComponent } from "src/app/shared/components/core/back-button/back-button.component";

const RARITY_ORDER: Record<string, number> = {
    'COMMON': 4,
    'RARE': 3,
    'EPIC': 2,
    'LEGENDARY': 1,
    'QUESTNUTRI_MASTER': 0,
};

interface RarityOption {
    label: string;
    value: AchievementRarity;
}

export interface AchievementWithProgress {
    achievement: AchievementModel;
    track: GameTrackModel | null;
    currentValue: number;
    targetValue: number;
    progressPercentage: number;
}

@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.page.html',
    styleUrls: ['./achievements.page.scss'],
    imports: [AchievementCardComponent, CommonModule, MultiSelectModule, DatePickerModule, FormsModule, BackButtonComponent],
})
export class AchievementsPage implements OnInit {
    private readonly achievementService = inject(AchievementService);
    private readonly gameService = inject(GameService);
    
    private rawAchievements = signal<AchievementModel[]>([]);
    private gameTracks = signal<GameTrackModel[]>([]);
    
    selectedRarities = signal<AchievementRarity[]>([]);
    dateRange = signal<Date[] | null>(null);

    rarityOptions: RarityOption[] = [
        { label: 'Comum', value: AchievementRarity.COMMON },
        { label: 'Raro', value: AchievementRarity.RARE },
        { label: 'Épico', value: AchievementRarity.EPIC },
        { label: 'Lendário', value: AchievementRarity.LEGENDARY },
        { label: 'Mestre QuestNutri', value: AchievementRarity.QUESTNUTRI_MASTER },
    ];

    private trackMap = computed(() => {
        const map = new Map<string, GameTrackModel>();
        for (const track of this.gameTracks()) {
            map.set(track.trackId, track);
        }
        return map;
    });

    achievementsWithProgress = computed<AchievementWithProgress[]>(() => {
        let filtered = this.rawAchievements();

        // Filter by rarity
        if (this.selectedRarities().length > 0) {
            filtered = filtered.filter(a => this.selectedRarities().includes(a.rarity));
        }

        // Filter by date range
        const range = this.dateRange();
        if (range && range.length === 2 && range[0] && range[1]) {
            const startDate = new Date(range[0]);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(range[1]);
            endDate.setHours(23, 59, 59, 999);

            filtered = filtered.filter(a => {
                if (!a.unlockedAt) return false;
                const unlockDate = new Date(a.unlockedAt);
                return unlockDate >= startDate && unlockDate <= endDate;
            });
        }

        const trackMap = this.trackMap();

        return [...filtered]
            .map(achievement => {
                const track = achievement.trackId ? trackMap.get(achievement.trackId) ?? null : null;
                const currentValue = track ? parseFloat(track.currentValue) || 0 : 0;
                const targetValue = parseFloat(achievement.targetValue) || 0;
                const progressPercentage = targetValue > 0 
                    ? Math.min(Math.round((currentValue / targetValue) * 100), 100) 
                    : 0;

                return {
                    achievement,
                    track,
                    currentValue,
                    targetValue,
                    progressPercentage,
                };
            })
            .sort((a, b) => {
                // First: unlocked achievements come before locked ones
                const aUnlocked = a.achievement.unlockedAt != null;
                const bUnlocked = b.achievement.unlockedAt != null;
                
                if (aUnlocked && !bUnlocked) return -1;
                if (!aUnlocked && bUnlocked) return 1;
                
                // If both unlocked, sort by unlock date (most recent first)
                if (aUnlocked && bUnlocked) {
                    const dateA = new Date(a.achievement.unlockedAt!).getTime();
                    const dateB = new Date(b.achievement.unlockedAt!).getTime();
                    if (dateA !== dateB) return dateB - dateA;
                }
                
                // Then sort by rarity (higher rarity first)
                const rarityA = RARITY_ORDER[a.achievement.rarity] ?? -1;
                const rarityB = RARITY_ORDER[b.achievement.rarity] ?? -1;
                return rarityB - rarityA;
            });
    });

    unlockedCount = computed(() =>
        this.rawAchievements().filter(a => a.unlockedAt != null).length
    );

    totalCount = computed(() => this.rawAchievements().length);

    progressPercentage = computed(() =>
        this.totalCount() > 0
            ? Math.round((this.unlockedCount() / this.totalCount()) * 100)
            : 0
    );

    onRarityChange(values: AchievementRarity[]) {
        this.selectedRarities.set(values);
    }

    onDateRangeChange(range: Date[] | null) {
        this.dateRange.set(range);
    }

    async ngOnInit() {
        const [achievements, tracks] = await Promise.all([
            this.achievementService.getAchievements(),
            this.gameService.getGameTracks(),
        ]);
        
        this.rawAchievements.set(achievements);
        this.gameTracks.set(tracks);
    }
}