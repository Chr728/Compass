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
