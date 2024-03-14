import React, {ReactNode, useEffect, useState} from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import {useUser} from "@/app/contexts/UserContext";
import {useProp} from "@/app/contexts/PropContext";
import Custom403 from "@/app/pages/403";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {Steps} from "intro.js-react";
import {useSearchParams} from "next/navigation";
import {introductionSteps, journalSteps, foodJournalSteps, createFoodJournalSteps, getFoodJournalSteps} from "@/app/lib/IntroJs/IntroJs";

const Renders = ({ children }: { children: ReactNode }) => {
    const {loading, introJsActive, handleIntroJsActive} = useProp();
    const [currentStep, setCurrentStep] = useState(0);
    const [introJsSteps, setIntroJsSteps] = useState<any>(introductionSteps);
    const [introJsOptions, setIntroJsOptions] = useState<any>();
    const [exitPath, setExitPath] = useState<string>('\\');
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const intro = searchParams.get('intro');
    console.log('is intro js active', introJsActive)
    const isPublicRoute = () => {
        return (
            pathname === "/login" ||
            pathname === "/register" ||
            pathname === "/logout" ||
            pathname === "/forgotpassword" ||
            pathname === "/"
        );
    }
    const { user } = useAuth();
    const { userInfo } = useUser();
    useEffect(() => {
        if(user && userInfo && isPublicRoute()){
            router.push('/tpage');
        }
        switch (pathname) {
            case '/tpage':
                if(intro == 'false'){
                    handleIntroJsActive(false);
                }else{
                    setIntroJsSteps(introductionSteps.steps);
                    setIntroJsOptions(introductionSteps.options);
                    setExitPath(introductionSteps.onExitPath);
                }
                break;
            case '/journals':
                setIntroJsSteps(journalSteps.steps)
                setIntroJsOptions(journalSteps.options)
                setExitPath(journalSteps.onExitPath)
                break;
            case '/getFoodJournals':
                if(intro == 'true'){
                    setIntroJsSteps(getFoodJournalSteps.steps)
                    setIntroJsOptions(getFoodJournalSteps.options)
                    setExitPath(getFoodJournalSteps.onExitPath)
                }else{
                    setIntroJsSteps(foodJournalSteps.steps)
                    setIntroJsOptions(foodJournalSteps.options)
                    setExitPath(foodJournalSteps.onExitPath)
                }

                break;
            case '/createFoodJournal':
                setIntroJsSteps(createFoodJournalSteps.steps)
                setIntroJsOptions(createFoodJournalSteps.options)
                setExitPath(createFoodJournalSteps.onExitPath)
                break;
                default:
                    handleIntroJsActive(false);
        }
    }, [pathname]);

    const handleBeforeChange = (nextStepIndex: number) => {
        setCurrentStep(nextStepIndex);
    };

    const handleExit = () => {
        if (currentStep === introJsSteps.length - 1) {
            exitPath!= '/' && router.push(exitPath);
        }
    }

// useEffect(() => {
    // 	const intro = introJs();
    // 	intro.setOptions(
    //
    // 		{
    // 		isActive: true,
    // 		steps: introductionSteps,
    // 		exitOnOverlayClick: false,
    //
    // 	},
    // 		)
    // 	intro.start()
    // }, []);



    if (!user && !userInfo && !loading && !isPublicRoute()) {
        return <Custom403 />;
    }else{
        return (
            <>
                {children}
                {children && introJsActive &&
                <Steps
                    enabled={introJsActive}
                    steps={introJsSteps}
                    initialStep={0}
                    onExit={handleExit}
                    onBeforeChange={handleBeforeChange}
                    options={introJsOptions}
                />
                }
            </>
        );
    }
};

export default Renders;