declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps.places {
  class Autocomplete {
    constructor(inputField: HTMLInputElement, options?: AutocompleteOptions);
    addListener(eventName: string, handler: () => void): void;
    getPlace(): PlaceResult;
  }

  interface AutocompleteOptions {
    componentRestrictions?: {
      country: string | string[];
    };
    fields?: string[];
    types?: string[];
  }

  interface PlaceResult {
    formatted_address?: string;
  }
}

export {}; 