import {
  userValidator,
  speedDialValidator,
  appointmentValidator,
  notificationPreferenceValidator,
  medicationValidator,
  moodJournalValidator,
  weightJournalValidator,
} from '../utils/databaseValidators';

describe('User Validator', () => {
  it('should validate a valid user attributes object', () => {
    const validUser: any = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    expect(() => userValidator(validUser)).not.toThrow();
  });

  it('should throw errors for invalid email', () => {
    const invalidEmailUser: any = {
      email: 'invalidemail',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    expect(() => userValidator(invalidEmailUser)).toThrow();
  });

  it('should throw errors for invalid first name', () => {
    const invalidFirstNameUser: any = {
      email: 'test@example.com',
      firstName: '123',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    expect(() => userValidator(invalidFirstNameUser)).toThrow();
  });

  it('should throw errors for invalid last name', () => {
    const invalidLastNameUser: any = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe123',
      phoneNumber: '1234567890',
    };

    expect(() => userValidator(invalidLastNameUser)).toThrow();
  });

  it('should throw errors for invalid phone number', () => {
    const invalidPhoneNumberUser: any = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: 'invalidnumber',
    };

    expect(() => userValidator(invalidPhoneNumberUser)).toThrow();
  });

  it('should throw errors for missing required fields', () => {
    const missingFieldsUser: any = {
      firstName: 'John',
      lastName: 'Doe',
    };

    expect(() => userValidator(missingFieldsUser)).toThrow();
  });
});

describe('Appointment Validator', () => {
  it('should validate a valid appointment attributes object', () => {
    const validAppointment: any = {
      appointmentWith: 'John Doe',
      reason: 'Regular checkup',
      date: '2023-12-15',
      time: '14:30',
      notes: 'Some notes',
    };

    expect(() => appointmentValidator(validAppointment)).not.toThrow();
  });

  it('should throw errors for invalid appointmentWith', () => {
    const invalidAppointmentWith: any = {
      appointmentWith: 'Invalid123',
      reason: 'Regular checkup',
      date: '2023-12-15',
      time: '14:30',
      notes: 'Some notes',
    };

    expect(() => appointmentValidator(invalidAppointmentWith)).toThrow();
  });

  it('should throw errors for invalid reason', () => {
    const invalidReason: any = {
      appointmentWith: 'John Doe',
      reason: 123,
      date: '2023-12-15',
      time: '14:30',
      notes: 'Some notes',
    };

    expect(() => appointmentValidator(invalidReason)).toThrow();
  });

  it('should throw errors for invalid date', () => {
    const invalidDate: any = {
      appointmentWith: 'John Doe',
      reason: 'Regular checkup',
      time: '14:30',
      notes: 'Some notes',
    };

    expect(() => appointmentValidator(invalidDate)).toThrow();
  });

  it('should throw errors for missing required fields', () => {
    const missingFieldsAppointment: any = {
      appointmentWith: 'John Doe',
      reason: 'Regular checkup',
    };

    expect(() => appointmentValidator(missingFieldsAppointment)).toThrow();
  });
});

describe('Speed Dial Validator', () => {
  it('should validate a valid speed dial contact', () => {
    const validContact: any = {
      contactName: 'John Doe',
      contactNumber: '1234567890',
    };

    expect(() => speedDialValidator(validContact)).not.toThrow();
  });

  it('should throw errors for invalid contactName', () => {
    const invalidContactName: any = {
      contactName: 'Invalid123',
      contactNumber: '1234567890',
    };

    expect(() => speedDialValidator(invalidContactName)).toThrow();
  });

  it('should throw errors for invalid contactNumber', () => {
    const invalidContactNumber: any = {
      contactName: 'John Doe',
      contactNumber: 'invalidNumber',
    };

    expect(() => speedDialValidator(invalidContactNumber)).toThrow();
  });
});

describe('Notification Preference Validator', () => {
  it('should validate for valid notification preferences', () => {
    const validPrefs: any = {
      activityReminders: true,
      medicationReminders: false,
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
    };

    expect(() => notificationPreferenceValidator(validPrefs)).not.toThrow();
  });

  it('should throw errors for invalid Activity notification preferences', () => {
    const invalidPrefs: any = {
      activityReminders: 'true',
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
    };

    expect(() => notificationPreferenceValidator(invalidPrefs)).toThrow();
  });

  it('should throw errors for invalid Medication notification preferences', () => {
    const invalidPrefs: any = {
      activityReminders: true,
      medicationReminders: 'true',
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
    };

    expect(() => notificationPreferenceValidator(invalidPrefs)).toThrow();
  });

  it('should throw errors for invalid Appointment notification preferences', () => {
    const invalidPrefs: any = {
      activityReminders: true,
      medicationReminders: false,
      appointmentReminders: 'true',
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
    };

    expect(() => notificationPreferenceValidator(invalidPrefs)).toThrow();
  });

  it('should throw errors for invalid FoodIntake notification preferences', () => {
    const invalidPrefs: any = {
      activityReminders: true,
      medicationReminders: false,
      appointmentReminders: true,
      foodIntakeReminders: 'false',
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
    };

    expect(() => notificationPreferenceValidator(invalidPrefs)).toThrow();
  });

  it('should throw errors for invalid Insulin Dosage notification preferences', () => {
    const invalidPrefs: any = {
      activityReminders: true,
      medicationReminders: false,
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: 'true',
      glucoseMeasurementReminders: false,
    };

    expect(() => notificationPreferenceValidator(invalidPrefs)).toThrow();
  });

  it('should throw errors for invalid Glucose Measurement notification preferences', () => {
    const invalidPrefs: any = {
      activityReminders: true,
      medicationReminders: false,
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: 'false',
    };

    expect(() => notificationPreferenceValidator(invalidPrefs)).toThrow();
  });
});

describe('Medication Validator', () => {
  it('should validate a valid medication attributes object', () => {
    const validMedication: any = {
      medicationName: 'Medicine A',
      dateStarted: '2023-12-15',
      time: '08:00',
      dosage: 1,
      unit: 'mg',
      frequency: 'Twice daily',
      route: 'Oral',
      notes: 'Take after meals.',
    };

    expect(() => medicationValidator(validMedication)).not.toThrow();
  });

  it('should throw errors for invalid medication name', () => {
    const invalidMedicationName: any = {
      medicationName: 123,
      dateStarted: '2023-12-15',
      time: '08:00',
      dosage: 1,
      unit: 'mg',
      frequency: 'Twice daily',
      route: 'Oral',
      notes: 'Take after meals.',
    };

    expect(() => medicationValidator(invalidMedicationName)).toThrow();
  });

  it('should throw errors for invalid date started', () => {
    const invalidDateStarted: any = {
      medicationName: 'Medicine A',
      dateStarted: 123, // Invalid dateStarted type
      time: '08:00',
      dosage: 1,
      unit: 'mg',
      frequency: 'Twice daily',
      route: 'Oral',
      notes: 'Take after meals.',
    };

    expect(() => medicationValidator(invalidDateStarted)).toThrow();
  });

  it('should throw errors for invalid time', () => {
    const invalidTime: any = {
      medicationName: 'Medicine A',
      dateStarted: '2023-12-15',
      time: 123, // Invalid time type
      dosage: 1,
      unit: 'mg',
      frequency: 'Twice daily',
      route: 'Oral',
      notes: 'Take after meals.',
    };

    expect(() => medicationValidator(invalidTime)).toThrow();
  });

  it('should throw errors for invalid dosage', () => {
    const invalidDosage: any = {
      medicationName: 'Medicine A',
      dateStarted: '2023-12-15',
      time: '08:00',
      dosage: '1', // Invalid dosage type
      unit: 'mg',
      frequency: 'Twice daily',
      route: 'Oral',
      notes: 'Take after meals.',
    };

    expect(() => medicationValidator(invalidDosage)).toThrow();
  });

  it('should throw errors for invalid unit', () => {
    const invalidUnit: any = {
      medicationName: 'Medicine A',
      dateStarted: '2023-12-15',
      time: '08:00',
      dosage: 1,
      unit: 123, // Invalid unit type
      frequency: 'Twice daily',
      route: 'Oral',
      notes: 'Take after meals.',
    };

    expect(() => medicationValidator(invalidUnit)).toThrow();
  });

  it('should throw errors for invalid frequency', () => {
    const invalidFrequency: any = {
      medicationName: 'Medicine A',
      dateStarted: '2023-12-15',
      time: '08:00',
      dosage: 1,
      unit: 'mg',
      frequency: 123, // Invalid frequency type
      route: 'Oral',
      notes: 'Take after meals.',
    };

    expect(() => medicationValidator(invalidFrequency)).toThrow();
  });

  it('should throw errors for invalid route', () => {
    const invalidRoute: any = {
      medicationName: 'Medicine A',
      dateStarted: '2023-12-15',
      time: '08:00',
      dosage: 1,
      unit: 'mg',
      frequency: 'Twice daily',
      route: 123, // Invalid route type
      notes: 'Take after meals.',
    };

    expect(() => medicationValidator(invalidRoute)).toThrow();
  });

  it('should throw errors for invalid notes', () => {
    const invalidNotes: any = {
      medicationName: 'Medicine A',
      dateStarted: '2023-12-15',
      time: '08:00',
      dosage: 1,
      unit: 'mg',
      frequency: 'Twice daily',
      route: 'Oral',
      notes: 123, // Invalid notes type
    };

    expect(() => medicationValidator(invalidNotes)).toThrow();
  });
});

describe('Mood Journal Validator', () => {
  it('should validate a valid mood journal attributes object', () => {
    const validMoodJournal: any = {
      howAreYou: 'Feeling good',
      stressSignals: {
        tired: 'Low',
        sleep: 'Normal',
        hunger: 'Low',
        overeating: 'No',
        depressed: 'No',
        pressure: 'Low',
        anxiety: 'No',
        attention: 'Normal',
        anger: 'No',
        headache: 'No',
      },
      date: '2023-12-15',
      notes: 'Feeling happy today!',
    };

    expect(() => moodJournalValidator(validMoodJournal)).not.toThrow();
  });

  it('should throw errors for invalid howAreYou', () => {
    const invalidHowAreYou: any = {
      howAreYou: 123,
      stressSignals: {
        tired: 'Low',
        sleep: 'Normal',
        hunger: 'Low',
        overeating: 'No',
        depressed: 'No',
        pressure: 'Low',
        anxiety: 'No',
        attention: 'Normal',
        anger: 'No',
        headache: 'No',
      },
      date: '2023-12-15',
      notes: 'Feeling happy today!',
    };

    expect(() => moodJournalValidator(invalidHowAreYou)).toThrow();
  });

  it('should throw errors for invalid stressSignals', () => {
    const invalidStressSignals: any = {
      howAreYou: 'Feeling good',
      stressSignals: 'Invalid',
      date: '2023-12-15',
      notes: 'Feeling happy today!',
    };

    expect(() => moodJournalValidator(invalidStressSignals)).toThrow();
  });

  it('should throw errors for invalid date', () => {
    const invalidDate: any = {
      howAreYou: 'Feeling good',
      stressSignals: {
        tired: 'Low',
        sleep: 'Normal',
        hunger: 'Low',
        overeating: 'No',
        depressed: 'No',
        pressure: 'Low',
        anxiety: 'No',
        attention: 'Normal',
        anger: 'No',
        headache: 'No',
      },
      date: 123,
      notes: 'Feeling happy today!',
    };

    expect(() => moodJournalValidator(invalidDate)).toThrow();
  });

  it('should throw errors for invalid notes', () => {
    const invalidNotes: any = {
      howAreYou: 'Feeling good',
      stressSignals: {
        tired: 'Low',
        sleep: 'Normal',
        hunger: 'Low',
        overeating: 'No',
        depressed: 'No',
        pressure: 'Low',
        anxiety: 'No',
        attention: 'Normal',
        anger: 'No',
        headache: 'No',
      },
      date: '2023-12-15',
      notes: 123,
    };

    expect(() => moodJournalValidator(invalidNotes)).toThrow();
  });
});

describe('Weight Journal Validator', () => {
  it('should validate a valid weight journal attributes object', () => {
    const validWeightJournal: any = {
      date: '2023-12-15', // Replace with a valid date string
      time: '14:30', // Replace with a valid time string
      weight: 70, // Replace with a valid weight value
      height: 175, // Replace with a valid height value
      unit: 'kg', // Replace with a valid unit value
      notes: 'Maintaining weight well.',
    };

    expect(() => weightJournalValidator(validWeightJournal)).not.toThrow();
  });

  it('should throw errors for invalid date', () => {
    const invalidDate: any = {
      date: 123, // Invalid date format
      time: '14:30', // Replace with a valid time string
      weight: 70,
      height: 175,
      unit: 'kg',
      notes: 'Maintaining weight well.',
    };

    expect(() => weightJournalValidator(invalidDate)).toThrow();
  });

  it('should throw errors for invalid time', () => {
    const invalidTime: any = {
      date: '2023-12-15', // Replace with a valid date string
      time: 123, // Invalid time type
      weight: 70,
      height: 175,
      unit: 'kg',
      notes: 'Maintaining weight well.',
    };

    expect(() => weightJournalValidator(invalidTime)).toThrow();
  });

  it('should throw errors for invalid weight', () => {
    const invalidWeight: any = {
      date: '2023-12-15', // Replace with a valid date string
      time: '14:30', // Replace with a valid time string
      weight: 'InvalidWeight', // Invalid weight type
      height: 175,
      unit: 'kg',
      notes: 'Maintaining weight well.',
    };

    expect(() => weightJournalValidator(invalidWeight)).toThrow();
  });

  it('should throw errors for invalid height', () => {
    const invalidHeight: any = {
      date: '2023-12-15', // Replace with a valid date string
      time: '14:30', // Replace with a valid time string
      weight: 70,
      height: 'InvalidHeight', // Invalid height type
      unit: 'kg',
      notes: 'Maintaining weight well.',
    };

    expect(() => weightJournalValidator(invalidHeight)).toThrow();
  });

  it('should throw errors for invalid unit', () => {
    const invalidUnit: any = {
      date: '2023-12-15', // Replace with a valid date string
      time: '14:30', // Replace with a valid time string
      weight: 70,
      height: 175,
      unit: 123, // Invalid unit type
      notes: 'Maintaining weight well.',
    };

    expect(() => weightJournalValidator(invalidUnit)).toThrow();
  });

  it('should throw errors for invalid notes', () => {
    const invalidNotes: any = {
      date: '2023-12-15', // Replace with a valid date string
      time: '14:30', // Replace with a valid time string
      weight: 70,
      height: 175,
      unit: 'kg',
      notes: 123, // Invalid notes type
    };

    expect(() => weightJournalValidator(invalidNotes)).toThrow();
  });

  // Add more test cases as needed to cover other scenarios
});
