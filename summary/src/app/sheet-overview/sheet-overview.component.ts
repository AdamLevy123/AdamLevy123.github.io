import {Component, OnInit} from '@angular/core';
import {GSheetService} from "../g-sheet.service";
import dayjs from 'dayjs/esm';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-sheet-overview',
  templateUrl: './sheet-overview.component.html',
  styleUrls: ['./sheet-overview.component.css']
})
export class SheetOverviewComponent implements OnInit {
  details: Overview | undefined;
  standaloneApp = false;

  constructor(private gService: GSheetService) {
  }

  ngOnInit(): void {
    this.standaloneApp = this.isStandaloneApp();
    this.loadData();
  }

  public getElapsedTime(): string {
    let dateTime = dayjs(`${this.details?.lastMealDate}T${this.details?.lastMealStartTime}`)
    const spentMinutes = dayjs(this.details?.spentTime, 'HH:mm').get('minutes');
    dateTime = dateTime.add(spentMinutes, 'minute');

    const now = dayjs();

    const diffHours = now.diff(dateTime, 'hours');
    const diffMinutes = now.diff(dateTime, 'minutes');
    const minutes = `${diffMinutes % 60}`.toString().padStart(2, '0');

    return `${diffHours}:${minutes}`;
  }

  refresh(): void {
    this.loadData();
  }

  private isStandaloneApp(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  private loadData() {
    this.gService.getSheetData().subscribe(res=> {
      this.details = res;
    });
  }
}

export const overviewAttributesMapping = {
  lastMealDate: 'Ostatnie data',
  lastMealStartTime: 'Start',
  lastMealEndTime: 'Koniec',
  spentTime: 'Trwało',
  elapsedTime: 'Minęło',
  nextMealTime: '+3h',
  amount: 'Ilość',
  notes: 'Uwagi',
  inProgress: 'Trwa'
}

export interface Overview {
  lastMealDate: string;
  lastMealStartTime: string;
  lastMealEndTime: string;
  spentTime: string;
  elapsedTime: string;
  nextMealTime: string;
  amount: string;
  notes: string,
  inProgress: boolean
}
