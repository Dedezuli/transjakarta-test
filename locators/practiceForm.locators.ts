export const PracticeFormLocators = {
  firstNameInput: '#firstName',
  lastNameInput: '#lastName',
  emailInput: '#userEmail',
  genderLabel: (gender: string) => `label[for^="gender-radio"]:text-is("${gender}")`,
  mobileInput: '#userNumber',

  dateOfBirthInput: '#dateOfBirthInput',
  monthSelect: '.react-datepicker__month-select',
  yearSelect: '.react-datepicker__year-select',
  dayOption: (day: string) =>
    `.react-datepicker__day--0${day.padStart(2, '0')}:not(.react-datepicker__day--outside-month)`,

  subjectsInput: '#subjectsInput',
  selectOption: (text: string) => `[id^="react-select-"][id*="-option-"]:text-is("${text}")`,
  hobbyLabel: (hobby: string) => `label[for^="hobbies-checkbox"]:text-is("${hobby}")`,
  uploadPictureInput: '#uploadPicture',
  currentAddressInput: '#currentAddress',
  stateInput: '#state input',
  cityInput: '#city input',
  submitButton: '#submit',

  modalTitle: '#example-modal-sizes-title-lg',
  modalTableRows: '.modal-body table tbody tr',
  closeModalButton: '#closeLargeModal',
} as const;
