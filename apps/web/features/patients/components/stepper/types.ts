export interface StepperData {
  // Paso 1 — Datos personales
  dui: string
  firstName: string
  middleName: string
  lastName: string
  secondLastName: string
  birthDate: string
  phone: string
  sex: string
  email: string
  maritalStatus: string

  // Paso 2 — Antecedentes
  chronicDiseases: string
  nonChronicDiseases: string
  medicalTreatments: string

  // Paso 3 — Estilo de vida
  sleepRoutine: string
  physicalActivity: string
  foodIntolerances: string
  dislikedFoods: string
  smokes: string
  drinksAlcohol: string
  dietWeekdays: { breakfast: string; lunch: string; dinner: string; snacks: string; liquids: string }
  dietWeekends:  { breakfast: string; lunch: string; dinner: string; snacks: string; liquids: string }

  // Paso 4 — Medidas y metas
  measures: {
    weight:  { goal: string; previous: string; current: string }
    height:  { goal: string; previous: string; current: string }
    waist:   { goal: string; previous: string; current: string }
    hip:     { goal: string; previous: string; current: string }
    arm:     { goal: string; previous: string; current: string }
    chest:   { goal: string; previous: string; current: string }
    thigh:   { goal: string; previous: string; current: string }
    bmi:     { goal: string; previous: string; current: string }
  }
  motivation: string
  nextAppointment: string
  personalizedAdvice: string

  // Paso 5 — Plan alimenticio
  mealPlan: {
    day: string
    breakfast: string
    lunch: string
    dinner: string
    snacks: string
  }[]
}

export const INITIAL_DATA: StepperData = {
  dui: '', firstName: '', middleName: '', lastName: '', secondLastName: '',
  birthDate: '', phone: '', sex: '', email: '', maritalStatus: '',
  chronicDiseases: '', nonChronicDiseases: '', medicalTreatments: '',
  sleepRoutine: '', physicalActivity: '', foodIntolerances: '', dislikedFoods: '',
  smokes: 'no', drinksAlcohol: 'no',
  dietWeekdays: { breakfast: '', lunch: '', dinner: '', snacks: '', liquids: '' },
  dietWeekends:  { breakfast: '', lunch: '', dinner: '', snacks: '', liquids: '' },
  measures: {
    weight: { goal: '', previous: '', current: '' },
    height: { goal: '', previous: '', current: '' },
    waist:  { goal: '', previous: '', current: '' },
    hip:    { goal: '', previous: '', current: '' },
    arm:    { goal: '', previous: '', current: '' },
    chest:  { goal: '', previous: '', current: '' },
    thigh:  { goal: '', previous: '', current: '' },
    bmi:    { goal: '', previous: '', current: '' },
  },
  motivation: '', nextAppointment: '', personalizedAdvice: '',
  mealPlan: [
    { day: 'L',  breakfast: '', lunch: '', dinner: '', snacks: '' },
    { day: 'Ma', breakfast: '', lunch: '', dinner: '', snacks: '' },
    { day: 'Mi', breakfast: '', lunch: '', dinner: '', snacks: '' },
    { day: 'J',  breakfast: '', lunch: '', dinner: '', snacks: '' },
    { day: 'V',  breakfast: '', lunch: '', dinner: '', snacks: '' },
    { day: 'S',  breakfast: '', lunch: '', dinner: '', snacks: '' },
    { day: 'D',  breakfast: '', lunch: '', dinner: '', snacks: '' },
  ],
}
