import { SupportedLanguageCode } from '@/config/languages'

export interface MultilingualContent {
  title: string
  instructions: string
  audioUrl?: string
  nipunOutcome?: string
  simplifiedText?: string
  vocabulary?: { term: string; translation: string }[]
}

export interface MultilingualLesson {
  id: string
  classLevel: number
  subject: 'mathematics_fln' | 'literacy_fln' | 'evs'
  subjectLabel: string
  topic: string
  nipunOutcome: string
  estimatedTime: string
  content: {
    hi: MultilingualContent
    sat?: MultilingualContent
    hoc?: MultilingualContent
    unr?: MultilingualContent
  }
}

export const MULTILINGUAL_LESSONS: MultilingualLesson[] = [
  {
    id: 'fln-math-c1-01',
    classLevel: 1,
    subject: 'mathematics_fln',
    subjectLabel: 'Mathematics FLN',
    topic: 'Count objects from 1 to 10',
    nipunOutcome: 'Recognises, counts and compares small quantities up to 10',
    estimatedTime: '20 mins',
    content: {
      hi: {
        title: '1 से 10 तक वस्तुएँ गिनना',
        instructions: 'चित्रों को ध्यान से देखें और आमों की कुल संख्या गिनें। फिर सही उत्तर पर टैप करें।',
        nipunOutcome: 'वस्तुओं को 10 तक सही क्रम में गिनना सीखें।',
        simplifiedText: 'आपके पास 5 आम हैं। अगर हम 3 और जोड़ते हैं, तो कुल 8 आम होंगे।',
        vocabulary: [
          { term: 'गिनती (Count)', translation: 'गिनती' },
          { term: 'कुल (Total)', translation: 'कुल' },
          { term: 'संख्या (Number)', translation: 'संख्या' },
        ],
      },
      sat: {
        title: '᱑ ᱠᱷᱚᱱ ᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱞᱮᱠᱷᱟᱭ ᱢᱮ (Count 1-10)',
        instructions: 'ᱩᱞ ᱠᱚ ᱞᱮᱠᱷᱟᱭ ᱢᱮ ᱟᱨ ᱥᱟᱹᱦᱤ ᱞᱮᱠᱷᱟ ᱨᱮ ᱴᱤᱯᱟᱹᱣ ᱢᱮ ᱾ (Count the mangoes and tap the correct number)',
        audioUrl: '/audio/santhali_counting.mp3',
        nipunOutcome: '᱑᱐ ᱫᱷᱟᱹᱵᱤᱡ ᱡᱤᱱᱤᱥ ᱠᱚ ᱥᱟᱹᱦᱤ ᱞᱮᱠᱷᱟ ᱪᱮᱫᱚᱜ ᱢᱮ ᱾',
        simplifiedText: 'ᱟᱢ ᱴᱷᱮᱱ ᱕ ᱴᱟᱝ ᱩᱞ ᱢᱮᱱᱟᱜ-ᱟ ᱾ ᱟᱨᱦᱚᱸ ᱓ ᱴᱟᱝ ᱮᱢᱟᱢ ᱠᱷᱟᱱ ᱘ ᱴᱟᱝ ᱦᱩᱭᱩᱜ-ᱟ ᱾',
        vocabulary: [
          { term: 'Count (ᱞᱮᱠᱷᱟ)', translation: 'ᱞᱮᱠᱷᱟ (Lekha)' },
          { term: 'Total (ᱡᱚᱛᱚ)', translation: 'ᱡᱚᱛᱚ (Joto)' },
          { term: 'Mango (ᱩᱞ)', translation: 'ᱩᱞ (Ul)' },
        ],
      },
      hoc: {
        title: 'Ho Mode: 1-10 Kaji (Counting 1 to 10 in Ho)',
        instructions: '[Ho Language Beta] Mango kaji suba lekha me. (Count the mangoes in Ho dialect)',
        nipunOutcome: '[Ho Beta] 10 jinis suba lekha kaji.',
        simplifiedText: 'Ho Teaching Draft: Am re 5 mango mena. Ar 3 em me, suba 8 jiba.',
        vocabulary: [
          { term: 'Count (Ho)', translation: 'Lekha / Kaji' },
          { term: 'Mango (Ho)', translation: 'Uli' },
        ],
      },
      unr: {
        title: 'Mundari Mode: Mid te Gele Lekha (1 to 10 in Mundari)',
        instructions: '[Mundari Language Beta] Uli lekha me ar sahi number re click me.',
        nipunOutcome: '[Mundari Beta] Gele jinis lekha itun.',
        simplifiedText: 'Mundari Teaching Draft: Am re 5 uli menah. Ora 3 om me, joto 8 hoba.',
        vocabulary: [
          { term: 'Count (Mundari)', translation: 'Lekha' },
          { term: 'Mango (Mundari)', translation: 'Uli' },
        ],
      },
    },
  },
  {
    id: 'fln-lit-c1-02',
    classLevel: 1,
    subject: 'literacy_fln',
    subjectLabel: 'Literacy FLN',
    topic: 'First Letter Sounds & Words',
    nipunOutcome: 'Identifies initial sounds of familiar words and matches pictures',
    estimatedTime: '15 mins',
    content: {
      hi: {
        title: 'पहला अक्षर और चित्र मिलान',
        instructions: 'चित्र देखें और उसके पहले अक्षर की आवाज पहचानें।',
        nipunOutcome: 'ध्वनि और अक्षर संबंध की पहचान करना।',
        simplifiedText: 'अ से अनार, आ से आम। चित्र देखकर सही अक्षर चुनें।',
        vocabulary: [
          { term: 'अक्षर (Letter)', translation: 'अक्षर' },
          { term: 'ध्वनि (Sound)', translation: 'ध्वनि' },
        ],
      },
      sat: {
        title: 'ᱚᱞ ᱪᱤᱠᱤ ᱟᱲᱟᱝ (Santhali Letter Sounds)',
        instructions: 'ᱪᱤᱛᱟᱹᱨ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱯᱩᱭᱞᱩ ᱟᱲᱟᱝ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱾',
        audioUrl: '/audio/santhali_letters.mp3',
        nipunOutcome: 'ᱟᱲᱟᱝ ᱟᱨ ᱪᱤᱠᱤ ᱩᱨᱩᱢ ᱾',
        simplifiedText: 'ᱚ ᱠᱷᱚᱱ ᱚᱞ, ᱟ ᱠᱷᱚᱱ ᱟᱢ ᱾',
        vocabulary: [
          { term: 'Letter (ᱪᱤᱠᱤ)', translation: 'ᱪᱤᱠᱤ (Chiki)' },
          { term: 'Sound (ᱟᱲᱟᱝ)', translation: 'ᱟᱲᱟᱝ (Arang)' },
        ],
      },
      hoc: {
        title: 'Ho Letter Sound Recognition (Beta)',
        instructions: '[Ho Beta] Chitar nel me ar pahla arang chunao me.',
        nipunOutcome: '[Ho Beta] Arang ar chiki samajh.',
        simplifiedText: 'Ho language draft for initial letter sound identification.',
        vocabulary: [{ term: 'Letter (Ho)', translation: 'Chiki' }],
      },
      unr: {
        title: 'Mundari Sound & Picture Match (Beta)',
        instructions: '[Mundari Beta] Chitar nel me ar pahla arang le me.',
        nipunOutcome: '[Mundari Beta] Arang ar chiki itun.',
        simplifiedText: 'Mundari language draft for initial letter sound matching.',
        vocabulary: [{ term: 'Letter (Mundari)', translation: 'Chiki' }],
      },
    },
  },
  {
    id: 'fln-evs-c2-03',
    classLevel: 2,
    subject: 'evs',
    subjectLabel: 'EVS (Environmental Studies)',
    topic: 'Plants Around Us & Leaf Colors',
    nipunOutcome: 'Identifies parts of plants and leaf colors in local environment',
    estimatedTime: '25 mins',
    content: {
      hi: {
        title: 'हमारे आसपास के पौधे',
        instructions: 'पेड़ों की पत्तियों का रंग देखें और पत्तियों का कार्य समझें।',
        nipunOutcome: 'पौधों के विभिन्न भागों को पहचानना।',
        simplifiedText: 'पौधों की पत्तियाँ हरी होती हैं क्योंकि उनमें हरा वर्णक (क्लोरोफिल) होता है।',
        vocabulary: [
          { term: 'पौधा (Plant)', translation: 'पौधा' },
          { term: 'पत्ती (Leaf)', translation: 'पत्ती' },
        ],
      },
      sat: {
        title: 'ᱟᱵᱚ ᱵᱮ formal ᱫᱟᱨᱮ ᱱᱟᱹᱲᱤ (Plants Around Us)',
        instructions: 'ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱨᱮᱱᱟᱜ ᱨᱚᱝ ᱧᱮᱞ ᱢᱮ ᱟᱨ ᱥᱟᱠᱟᱢ ᱨᱮᱱᱟᱜ ᱠᱟᱹᱢᱤ ᱵᱟᱰᱟᱭ ᱢᱮ ᱾',
        audioUrl: '/audio/santhali_plants.mp3',
        nipunOutcome: 'ᱫᱟᱨᱮ ᱨᱮᱱᱟᱜ ᱦᱟᱹᱴᱤᱧ ᱠᱚ ᱩᱨᱩᱢ ᱾',
        simplifiedText: 'ᱫᱟᱨᱮ ᱥᱟᱠᱟᱢ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱜᱮᱭᱟ ᱪᱮᱫᱟᱜ ᱥᱮ ᱚᱱᱟ ᱨᱮ ᱦᱟᱹᱨᱤᱭᱟᱹᱲ ᱨᱚᱝ ( क्लोरोफिल ) ᱢᱮᱱᱟᱜ-ᱟ ᱾',
        vocabulary: [
          { term: 'Plant (ᱫᱟᱨᱮ)', translation: 'ᱫᱟᱨᱮ (Dare)' },
          { term: 'Leaf (ᱥᱟᱠᱟᱢ)', translation: 'ᱥᱟᱠᱟᱢ (Sakam)' },
        ],
      },
      hoc: {
        title: 'Ho Language EVS: Daru Sakam (Beta)',
        instructions: '[Ho Beta] Daru sakam ar rang nel me.',
        nipunOutcome: '[Ho Beta] Daru re part kaji.',
        simplifiedText: 'Ho language draft for local environmental plant study.',
        vocabulary: [{ term: 'Plant (Ho)', translation: 'Daru' }],
      },
      unr: {
        title: 'Mundari EVS: Daru Sakam (Beta)',
        instructions: '[Mundari Beta] Daru sakam ar rang nel me.',
        nipunOutcome: '[Mundari Beta] Daru re part itun.',
        simplifiedText: 'Mundari language draft for plant study.',
        vocabulary: [{ term: 'Plant (Mundari)', translation: 'Daru' }],
      },
    },
  },
]

export const getLessonContentForLanguage = (
  lesson: MultilingualLesson,
  langCode: SupportedLanguageCode
): MultilingualContent => {
  return (
    lesson.content[langCode] ||
    lesson.content['sat'] ||
    lesson.content['hi']
  )
}
