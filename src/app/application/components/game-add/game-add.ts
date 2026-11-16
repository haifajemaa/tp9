
import { Component, OnInit, signal, inject } from '@angular/core';
import { Game } from '../../models/game';
import { Category } from '../../models/category';
import {form,FormField,FormRoot,required,pattern,min,applyEach,minLength} from '@angular/forms/signals';

import { GameService } from '../../services/game-service';
import { JsonPipe } from '@angular/common';

@Component({
  imports: [FormRoot, FormField, JsonPipe],
  selector: 'app-game-add',
  styleUrl: './game-add.css',
  templateUrl: './game-add.html',
})
export class GameAdd implements OnInit {

  categories = Object.values(Category);

  private gameService = inject(GameService);

  readonly gameModel = signal<Game>({
    id: "",
    name: "",
    price: 0,
    madeIn: "Tunisie",
    category: Category.Puzzle,
    isNew: true,
    shops: []
  });

  readonly gameForm = form(this.gameModel, path => {

    required(path.name, {
      message: "Nom obligatoire"
    });

    pattern(path.name, /^[A-Z].+$/, {
      message: "Le nom doit commencer par une majuscule"
    });

    required(path.price, {
      message: "Le prix est obligatoire"
    });

    min(path.price, 0.1, {
      message: "Le prix doit être supérieur à 0.1 DT"
    });

    applyEach(path.shops, shop => {

      required(shop, {
        message: "Champ obligatoire"
      });

      minLength(shop, 3, {
        message: "Longueur minimale 3 caractères"
      });

    });

  });

  games = this.gameService.games;

  onSubmit() {
    this.gameService.addGame(this.gameModel()).subscribe();
    this.resetForm();
    }

  resetForm() {
    this.gameModel.set({
      id: "",
      name: "",
      price: 0,
      madeIn: "Tunisie",
      category: Category.Puzzle,
      isNew: true,
      shops: []
    });
    this.gameForm().reset();
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe();
  }

}
