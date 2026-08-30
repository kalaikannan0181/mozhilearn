// Demo lesson content for SIH prototype.
// Mark: Demo lesson content for SIH prototype.
// This file is used for local presentation and reference.

export interface DemoLesson {
  id: string
  title_en: string
  title_ta: string
  subject: string
  grade_level: number
  original_content: string
  translated_content: string
  simplified_content_ta: string
  learning_objectives: string[]
  vocabulary: { en: string; ta: string }[]
  quiz_questions: {
    question_en: string
    question_ta: string
    options: string[]
    correct_answer: string
    explanation_ta: string
    difficulty: 'easy' | 'medium' | 'hard'
  }[]
}

export const demoLessons: DemoLesson[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    title_en: 'Photosynthesis',
    title_ta: 'ஒளிச்சேர்க்கை (Photosynthesis)',
    subject: 'Science',
    grade_level: 3,
    original_content: 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar. Leaves have a green color because of chlorophyll, which absorbs light energy.',
    translated_content: 'ஒளிச்சேர்க்கை என்பது தாவரங்கள் சூரிய ஒளி, நீர் மற்றும் கார்பன் டை ஆக்சைடைப் பயன்படுத்தி ஆக்ஸிஜன் மற்றும் சர்க்கரை வடிவிலான ஆற்றலை உருவாக்கும் செயல்முறையாகும். இலைகள் குளோரோபில் (பச்சை நிறமி) காரணமாக பச்சை நிறத்தைக் கொண்டுள்ளன, இது ஒளி ஆற்றலை உறிஞ்சுகிறது.',
    simplified_content_ta: 'தாவரங்கள் சூரிய ஒளி, நீர், மற்றும் காற்றைப் பயன்படுத்தி தங்களுக்குத் தேவையான உணவைத் தயாரிக்கும் முறைக்கு "ஒளிச்சேர்க்கை" என்று பெயர். செடிகளின் இலைகளில் இருக்கும் பச்சையம் (chlorophyll) தான் இதற்கு உதவுகிறது. இந்த முறையில் தாவரங்கள் மனிதர்களுக்குத் தேவையான ஆக்சிஜனை வெளியிடுகின்றன.',
    learning_objectives: [
      'Understand how plants make food using sunlight',
      'Identify the role of chlorophyll in leaves',
      'Recognize that plants release oxygen'
    ],
    vocabulary: [
      { en: 'Photosynthesis', ta: 'ஒளிச்சேர்க்கை' },
      { en: 'Chlorophyll', ta: 'பச்சையம்' },
      { en: 'Sunlight', ta: 'சூரிய ஒளி' }
    ],
    quiz_questions: [
      {
        question_en: 'What gas do plants release during photosynthesis?',
        question_ta: 'ஒளிச்சேர்க்கையின் போது தாவரங்கள் எந்த வாயுவை வெளியிடுகின்றன?',
        options: ['Oxygen (ஆக்ஸிஜன்)', 'Carbon Dioxide (கார்பன் டை ஆக்சைடு)', 'Nitrogen (நைட்ரஜன்)', 'Hydrogen (ஹைட்ரஜன்)'],
        correct_answer: 'Oxygen (ஆக்ஸிஜன்)',
        explanation_ta: 'ஒளிச்சேர்க்கையின் போது தாவரங்கள் ஆக்சிஜனை (Oxygen) வெளியிடுகின்றன, இது நாம் சுவாசிக்க உதவுகிறது.',
        difficulty: 'easy'
      },
      {
        question_en: 'What gives leaves their green color?',
        question_ta: 'இலைகளுக்கு பச்சை நிறத்தை கொடுப்பது எது?',
        options: ['Water (நீர்)', 'Chlorophyll (பச்சையம்)', 'Sunlight (சூரிய ஒளி)', 'Soil (மண்)'],
        correct_answer: 'Chlorophyll (பச்சையம்)',
        explanation_ta: 'பச்சையம் (Chlorophyll) தான் இலைகளுக்கு பச்சை நிறத்தைக் கொடுக்கிறது மற்றும் சூரிய ஒளியை உறிஞ்ச உதவுகிறது.',
        difficulty: 'easy'
      },
      {
        question_en: 'Which of the following is NOT needed for photosynthesis?',
        question_ta: 'ஒளிச்சேர்க்கைக்கு கீழே உள்ளவற்றில் எது தேவையில்லை?',
        options: ['Sunlight (சூரிய ஒளி)', 'Water (நீர்)', 'Oxygen (ஆக்சிஜன்)', 'Carbon Dioxide (கார்பன் டை ஆக்சைடு)'],
        correct_answer: 'Oxygen (ஆக்சிஜன்)',
        explanation_ta: 'தாவரங்கள் உணவு தயாரிக்க ஆக்சிஜனைப் பயன்படுத்துவதில்லை, மாறாக ஆக்சிஜனை வெளியிடுகின்றன.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    title_en: 'Basic Addition',
    title_ta: 'அடிப்படை கூட்டல் (Basic Addition)',
    subject: 'Mathematics',
    grade_level: 2,
    original_content: 'Addition is bringing two or more numbers together to make a new total. The symbol for addition is + (plus). For example, 3 + 2 equals 5.',
    translated_content: 'கூட்டல் என்பது புதிய மொத்தத்தை உருவாக்க இரண்டு அல்லது அதற்கு மேற்பட்ட எண்களை ஒன்றாக இணைப்பதாகும். கூட்டலின் குறியீடு + (பிளஸ்) ஆகும். உதாரணமாக, 3 + 2 என்பது 5 ஆகும்.',
    simplified_content_ta: 'கூட்டல் என்றால் இரண்டு அல்லது அதற்கு மேற்பட்ட எண்களை ஒன்றாகச் சேர்த்து மொத்த மதிப்பைக் காண்பது ஆகும். கூட்டலைக் குறிக்க நாம் "+" என்ற குறியீட்டைப் பயன்படுத்துகிறோம். உதாரணமாக, உங்களிடம் 3 ஆப்பிள்கள் உள்ளன, அம்மா மேலும் 2 தருகிறார் என்றால் மொத்தம் 5 ஆப்பிள்கள்.',
    learning_objectives: [
      'Learn to combine two numbers',
      'Understand the + addition sign',
      'Perform simple double-digit sum additions'
    ],
    vocabulary: [
      { en: 'Addition', ta: 'கூட்டல்' },
      { en: 'Total', ta: 'மொத்தம்' },
      { en: 'Plus Sign', ta: 'கூட்டல் குறி (+)' }
    ],
    quiz_questions: [
      {
        question_en: 'What is 5 + 4?',
        question_ta: '5 + 4-ன் மதிப்பு என்ன?',
        options: ['7', '8', '9', '10'],
        correct_answer: '9',
        explanation_ta: '5 உடன் 4-ஐக் கூட்டினால் 9 கிடைக்கும்.',
        difficulty: 'easy'
      },
      {
        question_en: 'Which symbol is used for addition?',
        question_ta: 'கூட்டலுக்குப் பயன்படுத்தப்படும் குறியீடு எது?',
        options: ['-', '+', 'x', '/'],
        correct_answer: '+',
        explanation_ta: '+ (பிளஸ்) என்பது கூட்டலுக்கான கணிதக் குறியீடு ஆகும்.',
        difficulty: 'easy'
      },
      {
        question_en: 'If you have 6 pencils and buy 3 more, how many do you have now?',
        question_ta: 'உங்களிடம் 6 பென்சில்கள் உள்ளன, மேலும் 3 வாங்கினால் இப்போது மொத்தம் எத்தனை பென்சில்கள் இருக்கும்?',
        options: ['8', '9', '10', '12'],
        correct_answer: '9',
        explanation_ta: '6 + 3 = 9 பென்சில்கள்.',
        difficulty: 'medium'
      }
    ]
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    title_en: 'Our National Flag',
    title_ta: 'நமது தேசியக் கொடி (Our National Flag)',
    subject: 'Social Studies',
    grade_level: 2,
    original_content: 'The National Flag of India is a horizontal tricolor of saffron, white, and green with the Ashoka Chakra (a 24-spoke wheel in navy blue) in the center. Saffron stands for courage, white stands for peace, and green stands for growth.',
    translated_content: 'இந்தியாவின் தேசியக் கொடி என்பது காவி, வெள்ளை மற்றும் பச்சை ஆகிய மூன்று வண்ணங்களைக் கொண்ட ஒரு மூவர்ணக் கொடியாகும். நடுவில் கடற்படை நீல நிறத்தில் 24 ஆரங்களைக் கொண்ட அசோக சக்கரம் உள்ளது. காவி தைரியத்தையும், வெள்ளை அமைதியையும், பச்சை வளர்ச்சியையும் குறிக்கிறது.',
    simplified_content_ta: 'நமது இந்தியத் தேசியக் கொடி ஒரு மூவர்ணக் கொடி ஆகும். இதில் காவி (தைரியம்), வெள்ளை (அமைதி/உண்மை), மற்றும் பச்சை (வளம்) ஆகிய மூன்று வண்ணங்கள் உள்ளன. கொடியின் நடுவே 24 கம்பிகளைக் கொண்ட நீல நிற அசோகச் சக்கரம் அமைந்துள்ளது.',
    learning_objectives: [
      'Identify the three colors of the flag',
      'Describe the meaning of each color',
      'Explain what the Ashoka Chakra is'
    ],
    vocabulary: [
      { en: 'National Flag', ta: 'தேசியக் கொடி' },
      { en: 'Saffron', ta: 'காவி நிறம்' },
      { en: 'Peace', ta: 'அமைதி' },
      { en: 'Ashoka Chakra', ta: 'அசோக சக்கரம்' }
    ],
    quiz_questions: [
      {
        question_en: 'How many colors are in the Indian National Flag?',
        question_ta: 'இந்தியத் தேசியக் கொடியில் எத்தனை வண்ணங்கள் உள்ளன?',
        options: ['2', '3', '4', '5'],
        correct_answer: '3',
        explanation_ta: 'தேசியக் கொடி மூவர்ணக் கொடி எனப்படும், இதில் காவி, வெள்ளை, பச்சை ஆகிய மூன்று வண்ணங்கள் உள்ளன.',
        difficulty: 'easy'
      },
      {
        question_en: 'What does the white color in our national flag stand for?',
        question_ta: 'தேசியக் கொடியில் உள்ள வெள்ளை நிறம் எதைக் குறிக்கிறது?',
        options: ['Courage (தைரியம்)', 'Peace and Truth (அமைதி மற்றும் உண்மை)', 'Growth (வளர்ச்சி)', 'Strength (வலிமை)'],
        correct_answer: 'Peace and Truth (அமைதி மற்றும் உண்மை)',
        explanation_ta: 'வெள்ளை நிறம் அமைதி மற்றும் உண்மையைக் குறிக்கிறது.',
        difficulty: 'easy'
      },
      {
        question_en: 'How many spokes are in the Ashoka Chakra?',
        question_ta: 'அசோக சக்கரத்தில் எத்தனை ஆரங்கள் (கம்பிகள்) உள்ளன?',
        options: ['20', '22', '24', '26'],
        correct_answer: '24',
        explanation_ta: 'தேசியக் கொடியின் நடுவே அமைந்துள்ள அசோக சக்கரத்தில் 24 ஆரங்கள் உள்ளன.',
        difficulty: 'medium'
      }
    ]
  }
]
