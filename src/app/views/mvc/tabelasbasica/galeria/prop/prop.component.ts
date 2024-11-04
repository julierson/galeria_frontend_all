import { Component, OnInit} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prop',
  templateUrl: 'prop.component.html',
  styleUrls: ['./prop.component.css'],
})

export class PropComponent implements OnInit {

  constructor(public router: ActivatedRoute) {
  }

  ngOnInit(): void {

  }
}
