import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api/api.service";
import { firstValueFrom } from "rxjs";
import { GameTrackModel, Track } from "src/app/shared/models/track.model";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly apiService = inject(ApiService);

    async getGameTracks() {
        const tracks = await firstValueFrom(
            this.apiService.authenticated.get<Track[]>('/game/tracks/me')
        );

        return tracks.map(GameTrackModel.from);
    }
}