import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api/api.service";
import { firstValueFrom } from "rxjs";
import { Achievement, AchievementModel } from "src/app/shared/models/achievement.model";

@Injectable({
    providedIn: 'root'
})
export class AchievementService {
    private readonly apiService = inject(ApiService);

    async getAchievements(): Promise<AchievementModel[]> {
        const achievements: Achievement[] = await firstValueFrom(
            this.apiService.authenticated.get<Achievement[]>('/game/achievements/me')
        );
        return achievements.map(a => AchievementModel.from(a));
    }
}