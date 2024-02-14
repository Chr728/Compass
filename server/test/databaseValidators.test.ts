import {
  userValidator,
  speedDialValidator,
  appointmentValidator,
  notificationPreferenceValidator,
  medicationValidator,
  moodJournalValidator,
  weightJournalValidator,
  activityJournalValidator,
  diabeticGlucoseJournalValidator,
  diabeticInsulinJournalValidator,
  foodIntakeJournalValidator,
} from "../utils/databaseValidators";

type ValidatorFunction = (data: any) => void;

interface TestParams {
  validator: ValidatorFunction;
  validData: any;
  invalidData: { [key: string]: any }[];
}

function runTests({ validator, validData, invalidData }: TestParams) {
  describe(validator, () => {
    it("should validate a valid attributes object", () => {
      expect(() => validator(validData)).not.toThrow();
    });

    invalidData.forEach((data, index) => {
      it(`should throw errors for invalid ${invalidData[index].incorrectData}`, () => {
        expect(() => validator(data)).toThrow();
      });
    });
  });
}

//Testing User Validator
runTests({
  validator: userValidator,
  validData: {
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "1234567890",
  },
  invalidData: [
    {
      email: "invalidemail",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "1234567890",
      incorrectData: "email",
    },
    {
      email: "test@example.com",
      firstName: "John123",
      lastName: "Doe",
      phoneNumber: "1234567890",
      incorrectData: "firstName",
    },
    {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe123",
      phoneNumber: "1234567890",
      incorrectData: "lastName",
    },
    {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "invalidNumberx",
      incorrectData: "phoneNumber",
    },
  ],
});

//Testing Appointment Validator
runTests({
  validator: appointmentValidator,
  validData: {
    appointmentWith: "John Doe",
    reason: "Regular checkup",
    date: "2023-12-15",
    time: "14:30",
    notes: "Some notes",
  },
  invalidData: [
    {
      appointmentWith: "Invalid123",
      reason: "Regular checkup",
      date: "2023-12-15",
      time: "14:30",
      notes: "Some notes",
      incorrectData: "appointmentWith",
    },
    {
      appointmentWith: "John Doe",
      reason: 123,
      date: "2023-12-15",
      time: "14:30",
      notes: "Some notes",
      incorrectData: "reason",
    },
    {
      appointmentWith: "John Doe",
      reason: "Regular checkup",
      time: "14:30",
      notes: "Some notes",
      incorrectData: "date",
    },
    {
      appointmentWith: "John Doe",
      reason: "Regular checkup",
      incorrectData: "time",
    },
  ],
});

//Testing Speed Dial Validator
runTests({
  validator: speedDialValidator,
  validData: {
    contactName: "John Doe",
    contactNumber: "1234567890",
  },
  invalidData: [
    {
      contactName: "Invalid123",
      contactNumber: "1234567890",
      incorrectData: "contactName",
    },
    {
      contactName: "John Doe",
      contactNumber: "invalidNumber",
      incorrectData: "contactNumber",
    },
  ],
});

//Testing Notification Preference Validator
runTests({
  validator: notificationPreferenceValidator,
  validData: {
    permissionGranted: false,
    activityReminders: true,
    medicationReminders: false,
    appointmentReminders: true,
    foodIntakeReminders: false,
    insulinDosageReminders: true,
    glucoseMeasurementReminders: false,
  },
  invalidData: [
    {
      permissionGranted: "false",
      activityReminders: true,
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
      incorrectData: "permissionGranted",
    },
    {
      permissionGranted: false,
      activityReminders: "true",
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
      incorrectData: "activityReminders",
    },
    {
      permissionGranted: false,
      activityReminders: true,
      medicationReminders: "true",
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
      incorrectData: "medicationReminders",
    },
    {
      permissionGranted: false,
      activityReminders: true,
      medicationReminders: false,
      appointmentReminders: "true",
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
      incorrectData: "appointmentReminders",
    },
    {
      permissionGranted: false,
      activityReminders: true,
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: "false",
      insulinDosageReminders: true,
      glucoseMeasurementReminders: false,
      incorrectData: "foodIntakeReminders",
    },
    {
      permissionGranted: false,
      activityReminders: true,
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: "true",
      glucoseMeasurementReminders: false,
      incorrectData: "insulinDosageReminders",
    },
    {
      permissionGranted: false,
      activityReminders: true,
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: false,
      insulinDosageReminders: true,
      glucoseMeasurementReminders: "false",
      incorrectData: "glucoseMeasurementReminders",
    },
  ],
});

//Testing Medication Validator
runTests({
  validator: medicationValidator,
  validData: {
    medicationName: "Medicine A",
    dateStarted: "2023-12-15",
    time: "08:00",
    dosage: 1,
    unit: "mg",
    frequency: "Twice daily",
    route: "Oral",
    notes: "Take after meals.",
  },
  invalidData: [
    {
      medicationName: 123,
      dateStarted: "2023-12-15",
      time: "08:00",
      dosage: 1,
      unit: "mg",
      frequency: "Twice daily",
      route: "Oral",
      notes: "Take after meals.",
      incorrectData: "medicationName",
    },
    {
      medicationName: "Medicine A",
      dateStarted: 123,
      time: "08:00",
      dosage: 1,
      unit: "mg",
      frequency: "Twice daily",
      route: "Oral",
      notes: "Take after meals.",
      incorrectData: "dateStarted",
    },
    {
      medicationName: "Medicine A",
      dateStarted: "2023-12-15",
      time: 123,
      dosage: 1,
      unit: "mg",
      frequency: "Twice daily",
      route: "Oral",
      notes: "Take after meals.",
      incorrectData: "time",
    },
    {
      medicationName: "Medicine A",
      dateStarted: "2023-12-15",
      time: "08:00",
      dosage: "1",
      unit: "mg",
      frequency: "Twice daily",
      route: "Oral",
      notes: "Take after meals.",
      incorrectData: "dosage",
    },
    {
      medicationName: "Medicine A",
      dateStarted: "2023-12-15",
      time: "08:00",
      dosage: 1,
      unit: 123,
      frequency: "Twice daily",
      route: "Oral",
      notes: "Take after meals.",
      incorrectData: "unit",
    },
    {
      medicationName: "Medicine A",
      dateStarted: "2023-12-15",
      time: "08:00",
      dosage: 1,
      unit: "mg",
      frequency: 123,
      route: "Oral",
      notes: "Take after meals.",
      incorrectData: "frequency",
    },
    {
      medicationName: "Medicine A",
      dateStarted: "2023-12-15",
      time: "08:00",
      dosage: 1,
      unit: "mg",
      frequency: "Twice daily",
      route: 123,
      notes: "Take after meals.",
      incorrectData: "route",
    },
    {
      medicationName: "Medicine A",
      dateStarted: "2023-12-15",
      time: "08:00",
      dosage: 1,
      unit: "mg",
      frequency: "Twice daily",
      route: "Oral",
      notes: 123,
      incorrectData: "notes",
    },
  ],
});

//Testing Mood Journal Validator
runTests({
  validator: moodJournalValidator,
  validData: {
    howAreYou: "Feeling good",
    stressSignals: {
      tired: "Low",
      sleep: "Normal",
      hunger: "Low",
      overeating: "No",
      depressed: "No",
      pressure: "Low",
      anxiety: "No",
      attention: "Normal",
      anger: "No",
      headache: "No",
    },
    date: "2023-12-15",
    notes: "Feeling happy today!",
  },
  invalidData: [
    {
      howAreYou: 123,
      stressSignals: {
        tired: "Low",
        sleep: "Normal",
        hunger: "Low",
        overeating: "No",
        depressed: "No",
        pressure: "Low",
        anxiety: "No",
        attention: "Normal",
        anger: "No",
        headache: "No",
      },
      date: "2023-12-15",
      notes: "Feeling happy today!",
      incorrectData: "howAreYou",
    },
    {
      howAreYou: "Feeling good",
      stressSignals: "Invalid",
      date: "2023-12-15",
      notes: "Feeling happy today!",
      incorrectData: "stressSignals",
    },
    {
      howAreYou: "Feeling good",
      stressSignals: {
        tired: "Low",
        sleep: "Normal",
        hunger: "Low",
        overeating: "No",
        depressed: "No",
        pressure: "Low",
        anxiety: "No",
        attention: "Normal",
        anger: "No",
        headache: "No",
      },
      date: 123,
      notes: "Feeling happy today!",
      incorrectData: "date",
    },
    {
      howAreYou: "Feeling good",
      stressSignals: {
        tired: "Low",
        sleep: "Normal",
        hunger: "Low",
        overeating: "No",
        depressed: "No",
        pressure: "Low",
        anxiety: "No",
        attention: "Normal",
        anger: "No",
        headache: "No",
      },
      date: "2023-12-15",
      notes: 123,
      incorrectData: "notes",
    },
  ],
});

//Testing Weight Journal Validator
runTests({
  validator: weightJournalValidator,
  validData: {
    date: "2023-12-15",
    time: "14:30",
    weight: 70,
    height: 175,
    unit: "kg",
    notes: "Maintaining weight well.",
  },
  invalidData: [
    {
      date: 123,
      time: "14:30",
      weight: 70,
      height: 175,
      unit: "kg",
      notes: "Maintaining weight well.",
      incorrectData: "date",
    },
    {
      date: "2023-12-15",
      time: 123,
      weight: 70,
      height: 175,
      unit: "kg",
      notes: "Maintaining weight well.",
      incorrectData: "time",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      weight: "InvalidWeight",
      height: 175,
      unit: "kg",
      notes: "Maintaining weight well.",
      incorrectData: "weight",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      weight: 70,
      height: "InvalidHeight",
      unit: "kg",
      notes: "Maintaining weight well.",
      incorrectData: "height",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      weight: 70,
      height: 175,
      unit: 123,
      notes: "Maintaining weight well.",
      incorrectData: "unit",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      weight: 70,
      height: 175,
      unit: "kg",
      notes: 123,
      incorrectData: "notes",
    },
  ],
});

//Testing Activity Journal validator
runTests({
  validator: activityJournalValidator,
  validData: {
    date: "2023-12-15",
    time: "14:30",
    activity: "Walking",
    duration: 30,
    notes: "Feeling good after walking.",
  },
  invalidData: [
    {
      date: 123,
      time: "14:30",
      activity: "Walking",
      duration: 30,
      notes: "Feeling good after walking.",
      incorrectData: "date",
    },
    {
      date: "2023-12-15",
      time: 123,
      activity: "Walking",
      duration: 30,
      notes: "Feeling good after walking.",
      incorrectData: "time",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      activity: 123,
      duration: 30,
      notes: "Feeling good after walking.",
      incorrectData: "activity",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      activity: "Walking",
      duration: "InvalidDuration",
      notes: "Feeling good after walking.",
      incorrectData: "duration",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      activity: "Walking",
      duration: 30,
      notes: 123,
      incorrectData: "notes",
    },
  ],
});

//Testing Diabetic Glucose Journal Validator
runTests({
  validator: diabeticGlucoseJournalValidator,
  validData: {
    date: "2023-12-15",
    mealTime: "Before meal",
    bloodGlucose: 70,
    unit: "mg/dL",
    notes: "Feeling good after walking.",
  },
  invalidData: [
    {
      date: 123,
      mealTime: "Before meal",
      bloodGlucose: 70,
      unit: "mg/dL",
      notes: "Feeling good after walking.",
      incorrectData: "date",
    },
    {
      date: "2023-12-15",
      mealTime: 123,
      bloodGlucose: 70,
      unit: "mg/dL",
      notes: "Feeling good after walking.",
      incorrectData: "mealTime",
    },
    {
      date: "2023-12-15",
      mealTime: "Before meal",
      bloodGlucose: "InvalidBloodGlucose",
      unit: "mg/dL",
      notes: "Feeling good after walking.",
      incorrectData: "bloodGlucose",
    },
    {
      date: "2023-12-15",
      mealTime: "Before meal",
      bloodGlucose: 70,
      unit: 123,
      notes: "Feeling good after walking.",
      incorrectData: "unit",
    },
    {
      date: "2023-12-15",
      mealTime: "Before meal",
      bloodGlucose: 70,
      unit: "mg/dL",
      notes: 123,
      incorrectData: "notes",
    },
  ],
});

//Testing Diabetic Insulin Journal Validator
runTests({
  validator: diabeticInsulinJournalValidator,
  validData: {
    date: "2023-12-15",
    time: "14:30",
    typeOfInsulin: "Insulin A",
    unit: 10,
    bodySite: "Arm",
    notes: "Feeling good after walking.",
  },
  invalidData: [
    {
      date: 123,
      time: "14:30",
      typeOfInsulin: "Insulin A",
      unit: 10,
      bodySite: "Arm",
      notes: "Feeling good after walking.",
      incorrectData: "date",
    },
    {
      date: "2023-12-15",
      time: 123,
      typeOfInsulin: "Insulin A",
      unit: 10,
      bodySite: "Arm",
      notes: "Feeling good after walking.",
      incorrectData: "time",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      typeOfInsulin: 123,
      unit: 10,
      bodySite: "Arm",
      notes: "Feeling good after walking.",
      incorrectData: "typeOfInsulin",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      typeOfInsulin: "Insulin A",
      unit: "InvalidUnit",
      bodySite: "Arm",
      notes: "Feeling good after walking.",
      incorrectData: "unit",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      typeOfInsulin: "Insulin A",
      unit: 10,
      bodySite: 123,
      notes: "Feeling good after walking.",
      incorrectData: "bodySite",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      typeOfInsulin: "Insulin A",
      unit: 10,
      bodySite: "Arm",
      notes: 123,
      incorrectData: "notes",
    },
  ],
});

//Food Intake Jounral Validator
runTests({
  validator: foodIntakeJournalValidator,
  validData: {
    date: "2023-12-15",
    time: "14:30",
    foodName: "Food A",
    mealType: "Breakfast",
    servingNumber: 1,
    notes: "Feeling good after walking.",
    calorie: 300
  },
  invalidData: [
    {
      date: 123,
      time: "14:30",
      foodName: "Food A",
      mealType: "Breakfast",
      servingNumber: 1,
      notes: "Feeling good after walking.",
      calorie: 300,
      incorrectData: "date",
    },
    {
      date: "2023-12-15",
      time: 123,
      foodName: "Food A",
      mealType: "Breakfast",
      servingNumber: 1,
      notes: "Feeling good after walking.",
      calorie: null,
      incorrectData: "time",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      foodName: 123,
      mealType: "Breakfast",
      servingNumber: 1,
      notes: "Feeling good after walking.",
      calorie: 300,
      incorrectData: "foodName",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      foodName: "Food A",
      mealType: 123,
      servingNumber: 1,
      notes: "Feeling good after walking.",
      calorie: 300,
      incorrectData: "mealType",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      foodName: "Food A",
      mealType: "Breakfast",
      servingNumber: "InvalidServingNumber",
      notes: "Feeling good after walking.",
      calorie: 300,
      incorrectData: "servingNumber",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      foodName: "Food A",
      mealType: "Breakfast",
      servingNumber: 1,
      notes: 123,
      calorie: 300,
      incorrectData: "notes",
    },
    {
      date: "2023-12-15",
      time: "14:30",
      foodName: "Food A",
      mealType: "Breakfast",
      servingNumber: 1,
      notes: 123,
      incorrectData: "calorie",
    },
  ],
});
