"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button";
import Image from "next/image";
import { useProp } from "../../contexts/PropContext";
import { sendSymptoms } from "@/app/http/symptomAPI";
import SpanHeader from "../../components/SpanHeader";

export default function ChooseSymptoms() {
    const logger = require("../../../logger");
    const router = useRouter();
    const { user } = useAuth();
    const { handlePopUp} = useProp();

    useEffect(() => {
		if (!user) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [user, router]);

  const symptoms = [
  'itching',
  'skin rash',
  'nodal skin eruptions',
  'dischromic  patches',
  'continuous sneezing',
  'shivering',
  'chills',
  'watering from eyes',
  'stomach pain',
  'acidity',
  'ulcers on tongue',
  'vomiting',
  'cough',
  'chest pain',
 'yellowish skin',
  'nausea',
  'loss of appetite',
  'abdominal pain',
  'yellowing of eyes',
  'burning micturition',
  'spotting  urination',
  'passage of gases',
  'internal itching',
  'indigestion',
  'muscle wasting',
  'patches in throat',
  'high fever',
  'extra marital contacts',
  'fatigue',
  'weight loss',
  'restlessness',
  'lethargy',
  'irregular sugar level',
  'blurred and distorted vision',
  'obesity',
  'excessive hunger',
  'increased appetite',
  'polyuria',
  'sunken eyes',
  'dehydration',
  'diarrhoea',
  'breathlessness',
  'family history',
  'mucoid sputum',
  'headache',
  'dizziness',
  'loss of balance',
  'lack of concentration',
  'stiff neck',
  'depression',
  'irritability',
  'visual disturbances',
  'back pain',
  'weakness in limbs',
  'neck pain',
  'weakness of one body side',
  'altered sensorium',
  'dark urine',
  'sweating',
  'muscle pain',
  'mild fever',
  'swelled lymph nodes',
  'malaise',
  'red spots over body',
  'joint pain',
  'pain behind the eyes',
  'constipation',
  'toxic look (typhos)',
  'belly pain',
  'yellow urine',
  'receiving blood transfusion',
  'receiving unsterile injections',
  'coma',
  'stomach bleeding',
  'acute liver failure',
  'swelling of stomach',
  'distention of abdomen',
  'history of alcohol consumption',
  'fluid overload',
  'phlegm',
  'blood in sputum',
  'throat irritation',
  'redness of eyes',
  'sinus pressure',
  'runny nose',
  'congestion',
  'loss of smell',
  'fast heart rate',
  'rusty sputum',
  'pain during bowel movements',
  'pain in anal region',
  'bloody stool',
  'irritation in anus',
  'cramps',
  'bruising',
  'swollen legs',
  'swollen blood vessels',
  'prominent veins on calf',
  'weight gain',
  'cold hands and feets',
  'mood swings',
  'puffy face and eyes',
  'enlarged thyroid',
  'brittle nails',
  'swollen extremeties',
  'abnormal menstruation',
  'muscle weakness',
  'anxiety',
  'slurred speech',
  'palpitations',
  'drying and tingling lips',
  'knee pain',
  'hip joint pain',
  'swelling joints',
  'painful walking',
  'movement stiffness',
  'spinning movements',
  'unsteadiness',
  'pus filled pimples',
  'blackheads',
  'scurring',
  'bladder discomfort',
  'foul smell of urine',
  'continuous feel of urine',
  'skin peeling',
  'silver like dusting',
  'small dents in nails',
  'inflammatory nails',
  'blister',
  'red sore around nose',
  'yellow crust ooze',
  ];

  const [selectedWords, setSelectedWords] = useState<any>([])

  const handleSymptomSelection = (selected: any) => {
    setSelectedWords(selected);
  };

  const handleClick = (item: any) => {
		if (!selectedWords.includes(item)) {
			setSelectedWords([...selectedWords, item])
		}
		
	}

  const handleSubmit = async() => {

    try{
      const response = await sendSymptoms(selectedWords);
      const results = await response.json();
      const result = results.result;
      const encodedSelectedWords = selectedWords.map((word: string) => encodeURIComponent(word));
      const encodedResult = encodeURIComponent(result);
      const displayResult = JSON.stringify([encodedSelectedWords, encodedResult]);
      router.push(`/symptomAI/chooseSymptom/${displayResult}`);

    }catch (error) {
        handlePopUp("error", "Error sending symptom list.");
      }

  }

  const handleDelete = (deletedWord: any) => {
    const updatedWords = selectedWords.filter((item: any) => item !== deletedWord);
    setSelectedWords(updatedWords);
  }


  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
        <SpanHeader
            onClick={() => router.push("/health")}
            headerText="Choose Your Symptoms">
        </SpanHeader>
        
        <div className="bg-eggshell max-w-[356px] max-h-[300px] flex flex-col m-4 p-8 border border-grey rounded-2xl font-sans text-darkgrey overflow-y-scroll shadow-lg">
            <ul>
              {
                symptoms
                .sort((a, b) => a.localeCompare(b)) 
                .map((item, index) => {
                  return <li key={index} onClick={() => handleClick(item)}>{item}</li>
                })
              }
          </ul>
        </div>

        <div className="mx-4 mt-1">
          <ul className="max-w-[356px] flex flex-col h-[90px] overflow-y-scroll space-y-2 items-center">
            {
              selectedWords.map((item: any, index: any) => {
                return <li key={index} className="rounded-2xl bg-blue text-white flex items-center space-x-2 font-sans px-2 h-[34px]">{item}
                <Image
                  src='/icons/cross.svg'
                  alt="Cross icon"
                  width={30}
                  height={30}
                  onClick={() => handleDelete(item)}
                />
                </li>
              })
            }
          </ul>
			</div>

      <div className="mt-2 mb-24 space-x-2 self-center">
        <Button
          type="button"
          text="Reset"
          style={{ width: '140px', height: '48px', backgroundColor: 'var(--Red, #FF7171)' }}
          onClick={() => router.push("/health")} 
        />
        <Button
          type="submit"
          text="Submit"
          style={{ width: '140px', height: '48px', textAlign: 'center' }}
          onClick={handleSubmit} 
        />
      </div>

      
    </div>
  )
}
