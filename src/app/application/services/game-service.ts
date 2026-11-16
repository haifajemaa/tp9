
import { Injectable, signal, inject } from '@angular/core';
import { Game } from '../models/game';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const URL = "http://localhost:3000/games";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly _games = signal<Game[]>([]);
  games = this._games.asReadonly();

  private readonly _http = inject(HttpClient);

  getGames(): Observable<Game[]> {
    return this._http.get<Game[]>(URL).pipe(
      tap(jeux => this._games.set(jeux))
    );
  }

  addGame(game: Omit<Game, 'id'>): Observable<Game> {
    return this._http.post<Game>(URL, game).pipe(
      tap(jeu =>
        this._games.update(jeux => [...jeux, jeu])
      )
    );
  }
}
