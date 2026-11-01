import { OnboardingFlow } from "@/screens/onboarding/flow";

/** First launch: the tabs send here while there is no profile; once there is one, it opens the app. */
const OnboardingLayout = () => <OnboardingFlow mode="first" />;

export default OnboardingLayout;
