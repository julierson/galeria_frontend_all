import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homeslide',
  templateUrl: './homeslide.component.html',
  styleUrls: ['./homeslide.component.css']
})
export class HomeslideComponent implements OnInit {

  myInterval: number | false = 6000;
  slides: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
    setTimeout( () => {
      this.slides.push({image: `assets/img/home/home-1.png`});
      this.slides.push({image: `assets/img/home/home-2.png`});
      this.slides.push({image: `assets/img/home/home-3.png`});
    }, 500);
  }

}
