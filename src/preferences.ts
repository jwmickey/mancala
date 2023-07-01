import type { AppSettings } from "./consts";
import { SETTINGS_KEY, DELAY_DEFAULT } from "./consts";

const DEFAULT_SETTINGS: AppSettings = {
    delay: DELAY_DEFAULT
}

export function loadPreferences(): AppSettings {
    const settings = window.localStorage.getItem(SETTINGS_KEY);
    if (!settings) return DEFAULT_SETTINGS;

    try {
        const parsed = JSON.parse(settings);
        return parsed;
    } catch (error) {
        return DEFAULT_SETTINGS
    }
}

export function savePreferences(settings: AppSettings) {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}