import { InputSignal } from "@angular/core";

type ExtractRawInputs<T> = {
  [K in keyof T as T[K] extends InputSignal<any> ? K : never]:
    T[K] extends InputSignal<infer U> ? U : never;
};

export type ComponentKeys<T, O extends keyof any = never> = Omit<ExtractRawInputs<T>, O>;