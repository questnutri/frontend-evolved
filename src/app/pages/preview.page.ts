import { Component } from "@angular/core";
import { QnBigCalendarComponent } from "@qn/components/core";

@Component({
    selector: 'app-preview',
    template: `
    <qn-big-calendar />
    `,
    imports: [QnBigCalendarComponent]
})
export class PreviewPage {

}