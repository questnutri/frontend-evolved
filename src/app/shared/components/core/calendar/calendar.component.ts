import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonCard, IonContent } from '@ionic/angular/standalone';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, format } from 'date-fns';
import { QnDiv } from "@qn/components/basic";

@Component({
    imports: [IonContent, IonCard, CommonModule, QnDiv],
    selector: 'qn-big-calendar',
    template: `
  <ion-content class="p-4">
    <ion-card class="p-4 shadow-md">
      <div class="flex justify-between items-center mb-4">
        <button pButton icon="pi pi-chevron-left" (click)="previousMonth()"></button>
        <h2 class="text-xl font-semibold">{{ format(currentDate, 'MMMM yyyy') }}</h2>
        <button pButton icon="pi pi-chevron-right" (click)="nextMonth()"></button>
      </div>

      <div class="grid grid-cols-7 text-center font-semibold mb-2">
          </div>

          <qn-div grid columns="1fr 1fr 1fr 1fr 1fr 1fr 1fr">
            @for(day of weekDays; track $index) {
            <qn-div width="100px" marginX="10px" alignItems="center">
                {{day}}
            </qn-div>
            }
        @for(day of days; track $index) {
            <qn-div [color]='isToday(day) ? "red" : "blue"' width="100px" height="100px" margin="10px">
                {{format(day, 'd')}}
            </qn-div>
          <!-- <div
               [class.text-gray-400]="!isCurrentMonth(day)"
               [class.bg-primary]="isToday(day)"
               [class.text-white]="isToday(day)"
            >
            @if(isToday(day)) { {{ 'Today' }} } @else {
                {{ format(day, 'd') }}
            }
          </div> -->
        }
    </qn-div>
    </ion-card>
  </ion-content>
  `,
    // styles: `
    // @use '../../../../../app.scss';`

})
export class QnBigCalendarComponent {
    currentDate = new Date();
    weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days: Date[] = [];

    constructor() {
        this.generateCalendar();
    }

    format(date: Date, fmt: string) {
        return format(date, fmt);
    }

    generateCalendar() {
        const start = startOfWeek(startOfMonth(this.currentDate));
        const end = endOfWeek(endOfMonth(this.currentDate));
        this.days = eachDayOfInterval({ start, end });
    }

    previousMonth() {
        this.currentDate = subMonths(this.currentDate, 1);
        this.generateCalendar();
    }

    nextMonth() {
        this.currentDate = addMonths(this.currentDate, 1);
        this.generateCalendar();
    }

    isCurrentMonth(day: Date) {
        return isSameMonth(day, this.currentDate);
    }

    isToday(day: Date) {
        return isToday(day);
    }
}
