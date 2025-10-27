import { Component } from "@angular/core";
import { QnSidebarComponent, QnTopbarComponent, QnBigCalendarComponent } from "@qn/components/core";

@Component({
    selector: 'app-preview',
    template: `
    <qn-big-calendar />
    `,
    imports: [QnSidebarComponent, QnTopbarComponent, QnBigCalendarComponent]
})
export class PreviewPage {

}