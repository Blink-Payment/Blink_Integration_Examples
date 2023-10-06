declare global {
  interface Window {
    hostedFields: {
      classes: {
        Form: new (form: HTMLFormElement, options: any) => any;
        Field: new (field: HTMLInputElement, options: any) => any;
      };
      forms: any[];
    };
  }

  interface JQuery {
    hostedField: (options?: any) => JQuery;
    hostedForm: (options?: any) => JQuery;
  }
}

export {};
