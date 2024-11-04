import { Component, OnInit} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sincronismo',
  templateUrl: 'sincronismo.component.html',
  styleUrls: ['./sincronismo.component.css'],
})

export class SincronismoComponent implements OnInit {

  constructor(public router: ActivatedRoute) {
  }

  ngOnInit(): void {

  }
}
