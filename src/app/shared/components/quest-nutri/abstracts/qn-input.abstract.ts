import { Directive, input, model, signal } from "@angular/core";
import { QnComponent } from "../../qn-component/qn-component.abstract";

@Directive({})
export abstract class QnInput<T = string> extends QnComponent {
    value = model<T>();
    placeholder = input<string>('');
    disabled = input<boolean>(false);
    size = input<string>("8px");
}