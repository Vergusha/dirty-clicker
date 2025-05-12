import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Import language files
import en from './en';
import ru from './ru';

// Define supported languages
export type Language = 'en' | 'ru';

// Define translations interface
interface Translations {
  [key: string]: any;
}

// Define context interface
interface LocalizationContextType {
  t: (key: string, params?: Record<string, any>) => string;
  locale: Language;
  setLocale: (locale: Language) => void;
  translations: Translations;
  languages: { code: Language; name: string }[];
}

// Define translations map
const translations: Record<Language, Translations> = {
  en,
  ru,
};

// Define available languages with proper names
const languages = [
  { code: 'en' as Language, name: 'English' },
  { code: 'ru' as Language, name: 'Русский' },
];

// Create context with default values
const LocalizationContext = createContext<LocalizationContextType>({
  t: () => '',
  locale: 'en',
  setLocale: () => {},
  translations: {},
  languages: languages,
});

// Storage key for persisting language preference
const LANGUAGE_PREFERENCE_KEY = 'language_preference';

// Provider component
export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem(LANGUAGE_PREFERENCE_KEY);
        if (savedLocale && (savedLocale === 'en' || savedLocale === 'ru')) {
          setLocaleState(savedLocale as Language);
        }
      } catch (error) {
        console.warn('Failed to load language preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadLanguagePreference();
  }, []);

  // Save language preference when it changes
  const setLocale = (newLocale: Language) => {
    setLocaleState(newLocale);
    AsyncStorage.setItem(LANGUAGE_PREFERENCE_KEY, newLocale).catch(error => {
      console.warn('Failed to save language preference:', error);
    });
  };

  // Translation function
  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    // Navigate through nested keys
    for (const k of keys) {
      if (value && Object.prototype.hasOwnProperty.call(value, k)) {
        value = value[k];
      } else {
        // If key not found, return the key itself
        return key;
      }
    }
    
    // Return the value if it's a string
    if (typeof value === 'string') {
      // Replace parameters if they exist
      if (params) {
        return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
          return result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
        }, value);
      }
      return value;
    }
    
    // If value is not a string (e.g., it's an object), return the key
    return key;
  };

  // Don't render children until initial language is loaded
  if (!isLoaded) {
    return null;
  }

  const value = {
    t,
    locale,
    setLocale,
    translations: translations[locale],
    languages,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

// Hook for easy access to localization
export const useLocalization = () => useContext(LocalizationContext);