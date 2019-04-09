import { Stop } from './../stop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stop-passage-list',
  templateUrl: './stop-passage-list.component.html',
  styleUrls: ['./stop-passage-list.component.scss']
})
export class StopPassageListComponent implements OnInit {
  public stops: Array<Stop> = [];

  constructor() { }

  ngOnInit() {
    // Load stops from config file service
    this.stops.push({ routeId: '72', stopId: '60276' });
  }

}
