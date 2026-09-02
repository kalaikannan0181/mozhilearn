export type SupportedLanguageCode = 'hi' | 'sat' | 'hoc' | 'unr';

export type CapabilityStatus = boolean | 'verify-selected-model';

export interface LanguageOption {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  script: string;
  direction: 'ltr';
  enabled: boolean;
  status: 'active' | 'beta' | 'coming_soon';
  voiceAvailable: boolean;
  offlinePackAvailable: boolean;
}

export interface LanguageCapabilities {
  name: string;
  nativeName: string;
  script: string;
  translation: CapabilityStatus;
  asr: CapabilityStatus;
  tts: CapabilityStatus;
  offlinePack: boolean;
  status: 'active' | 'beta' | 'coming_soon';
  primaryProvider: 'bhashini' | 'indictrans2' | 'glossary_fallback';
  fallbackProvider?: 'indictrans2' | 'glossary_fallback';
}

export const LANGUAGE_CAPABILITIES: Record<SupportedLanguageCode, LanguageCapabilities> = {
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    translation: true,
    asr: true,
    tts: true,
    offlinePack: true,
    status: 'active',
    primaryProvider: 'bhashini',
  },
  sat: {
    name: 'Santhali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki / Devanagari',
    translation: true,
    asr: true,
    tts: 'verify-selected-model',
    offlinePack: true,
    status: 'active',
    primaryProvider: 'bhashini',
    fallbackProvider: 'indictrans2',
  },
  hoc: {
    name: 'Ho',
    nativeName: 'Ho',
    script: 'Warang Citi / Devanagari',
    translation: 'verify-selected-model',
    asr: 'verify-selected-model',
    tts: 'verify-selected-model',
    offlinePack: false,
    status: 'beta',
    primaryProvider: 'bhashini',
    fallbackProvider: 'glossary_fallback',
  },
  unr: {
    name: 'Mundari',
    nativeName: 'Mundari',
    script: 'Mundari Bani / Devanagari',
    translation: 'verify-selected-model',
    asr: 'verify-selected-model',
    tts: 'verify-selected-model',
    offlinePack: false,
    status: 'beta',
    primaryProvider: 'glossary_fallback',
    fallbackProvider: 'bhashini',
  },
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    direction: 'ltr',
    enabled: true,
    status: 'active',
    voiceAvailable: true,
    offlinePackAvailable: true,
  },
  {
    code: 'sat',
    name: 'Santhali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki / Devanagari support',
    direction: 'ltr',
    enabled: true,
    status: 'active',
    voiceAvailable: true,
    offlinePackAvailable: true,
  },
  {
    code: 'hoc',
    name: 'Ho',
    nativeName: 'Ho',
    script: 'Warang Citi / Devanagari support',
    direction: 'ltr',
    enabled: true,
    status: 'beta',
    voiceAvailable: false,
    offlinePackAvailable: false,
  },
  {
    code: 'unr',
    name: 'Mundari',
    nativeName: 'Mundari',
    script: 'Mundari Bani / Devanagari support',
    direction: 'ltr',
    enabled: true,
    status: 'beta',
    voiceAvailable: false,
    offlinePackAvailable: false,
  },
];

export const getLanguageByCode = (code: string): LanguageOption => {
  return (
    SUPPORTED_LANGUAGES.find((lang) => lang.code === code) ||
    SUPPORTED_LANGUAGES[0]
  );
};
